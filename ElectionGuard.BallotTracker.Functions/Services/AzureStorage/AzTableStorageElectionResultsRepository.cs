using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

using ElectionGuard.BallotTracker.Functions.Logging;
using ElectionGuard.BallotTracker.Functions.Models;
using ElectionGuard.BallotTracker.Functions.Services.AzureStorage.TableEntities;
using System.Diagnostics;
using System.Net;

namespace ElectionGuard.BallotTracker.Functions.Services.AzureStorage
{
    public class AzTableStorageElectionResultsRepository : IElectionResultsRepository
    {
        private const string BallotTrackerConnectionStringKey = "BallotTrackerStorage";
        private const string BallotStatusTableKey = "BallotStatusTable";
        private const string ElectionSummaryTableKey = "ElectionSummaryTable";

        public const string ElectionSummaryPartitionKey = "results";
        public const string ElectionSummaryRowKey = "results";

        private ILogger _logger;

        private Lazy<string> _ballotStatusTable;
        private Lazy<string> _electionSummaryTable;

        // TODO: Abstract an interface for working with Cosmos Table API to support
        // unit testing
        private Lazy<CloudTableClient> _tableClient;

        public AzTableStorageElectionResultsRepository(IConfiguration configuration, ILoggerFactory factory)
        {
            _logger = factory.CreateAzureFunctionLogger<AzTableStorageElectionResultsRepository>();
            _tableClient = new Lazy<CloudTableClient>(() =>
            {
                var cs = configuration.GetValue<string>(BallotTrackerConnectionStringKey);
                var account = CloudStorageAccount.Parse(cs);
                return account.CreateCloudTableClient();
            });

            _ballotStatusTable = new Lazy<string>(() =>
            {
                var table = configuration.GetValue<string>(BallotStatusTableKey);
                return table ?? "BallotStatus";
            });

            _electionSummaryTable = new Lazy<string>(() =>
            {
                var table = configuration.GetValue<string>(ElectionSummaryTableKey);
                return table ?? "ElectionSummary";
            });
        }

        public async Task<List<BallotStatus>> GetBallotStatusForTokenPattern(string pattern)
        {
            var rowKeyPattern = pattern.ToBallotStatusKeyFormat();
            var partKey = rowKeyPattern.ToBallotStatusPartitionKey();
            if (partKey is null)
            {
                throw new InvalidOperationException($"Cannot retreive ballot status list with token less than {BallotStatusEntity.MinKeyLength}");
            }

            CloudTable ballotStatus = await GetBallotStatusTable();

            var filter = GetStartsWithFilterForColumn("RowKey", partKey, rowKeyPattern);
            var query = new TableQuery<BallotStatusEntity>().Where(filter);

            TableContinuationToken continuation = null;
            var list = new List<BallotStatus>();
            do
            {
                var segment = await ballotStatus.ExecuteQuerySegmentedAsync(query, continuation);
                continuation = segment.ContinuationToken;
                list.AddRange(segment.Select(e => new BallotStatus
                {
                    TrackingId = e.TrackingId,
                    ApproximateCastTime = e.ApproximateCastTime,
                    Location = e.Location,
                    // TODO: Add details and status for handling spoiled ballots
                }));
            } while (continuation != null);
            return list;
        }

        public async Task<ElectionSummary> GetElectionSummary()
        {
            var table = await GetElectionSummaryTable();
            var op = TableOperation.Retrieve<ElectionSummaryEntity>(ElectionSummaryPartitionKey, ElectionSummaryRowKey);
            var result = await table.ExecuteAsync(op);

            if (result.HttpStatusCode == (int) HttpStatusCode.OK)
            {
                var entity = result.Result as ElectionSummaryEntity;
                return entity.ToElectionSummary();
            }
            else
            {
                _logger.LogWarning($"Failed to get election summary, code: {result.HttpStatusCode}");
                return null;
            }
        }

        public async Task ImportBallotStatusTrackingData(IEnumerable<BallotStatus> ballotStatuses, bool onlyIfEmpty = false)
        {
            try
            {
                if (ballotStatuses != null)
                {
                    var table = await GetBallotStatusTable();
                    var hasRecords = await HasRecords<BallotStatusEntity>(table);
                    if (!(onlyIfEmpty && hasRecords))
                    {
                        var entities = GetBallotStatusEntities(ballotStatuses);
                        if (hasRecords)
                        {
                            await table.DeleteAsync();
                            await table.SafeCreateIfNotExists(_logger);
                        }
                        await InsertBallotStatusRecords(table, entities);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to import tracking data.");
                throw;
            }
        }

        public async Task ImportElectionResultsData(ElectionSummary electionSummary)
        {
            try
            {
                if (electionSummary != null)
                {
                    var table = await GetElectionSummaryTable();
                    var operation = TableOperation.InsertOrReplace(electionSummary.ToElectionSummaryEntity());
                    await table.ExecuteAsync(operation);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to import tracking data.");
                throw;
            }
        }

        private List<List<BallotStatusEntity>> BreakIntoMaxBatches(IGrouping<string, BallotStatusEntity> group)
        {
            const int MaxBatchCount = 100;

            var list = group.ToList();
            var total = list.Count;
            var batchesNeeded = 1 + total / MaxBatchCount;

            var batches = new List<List<BallotStatusEntity>>();

            for (int i = 0; i < batchesNeeded; i++)
            {
                var index = i * MaxBatchCount;
                var count = Math.Min(list.Count - index, MaxBatchCount);
                if (count > 0)
                {
                    batches.Add(list.GetRange(index, count));
                }
            }
            return batches;
        }

        private IEnumerable<BallotStatusEntity> GetBallotStatusEntities(IEnumerable<BallotStatus> ballotStatuses)
        {
            var entities = ballotStatuses.Select(status => status.ToBallotStatusEntity());
            return entities;
        }

        private async Task<CloudTable> GetBallotStatusTable(bool createTable = true)
        {
            var table = TableClient.GetTableReference(_ballotStatusTable.Value);

            if (createTable && !await table.ExistsAsync())
            {
                await table.SafeCreateIfNotExists(_logger);
            }

            return table;
        }

        private async Task<CloudTable> GetElectionSummaryTable(bool createTable = true)
        {
            var table = TableClient.GetTableReference(_electionSummaryTable.Value);

            if (createTable && !await table.ExistsAsync())
            {
                await table.SafeCreateIfNotExists(_logger);
            }

            return table;
        }

        private string GetStartsWithFilterForColumn(string column, string partitionKey, string pattern)
        {
            // The StartsWith filter is created by taking the pattern, running it through a 
            // greater than or equal filter.  Then it is combined with a less than filter for
            // the pattern with its last character incremented.

            // For example, the if the pattern is 'abcd', then you compare for conditions in which
            // the value is greater than 'abcd'.  This would include: 'abcde', 'abcdghi', and
            // 'abceff'.  The last pattern match we don't want.
            // Then, you also filter based on the value being less than the pattern with its last
            // character incremented.  In this example, we would look for items less than 'abce'.

            // Adapted from:
            // https://stackoverflow.com/questions/35804458/can-partitionkey-be-queried-with-startswith
            var len = pattern.Length - 1;
            var nextLastChar = pattern[len] + 1;
            var nextToken = pattern.Substring(0, len) + (char) nextLastChar;

            var gte = TableQuery.GenerateFilterCondition(column,
                QueryComparisons.GreaterThanOrEqual, pattern);
            var lt = TableQuery.GenerateFilterCondition(column,
                QueryComparisons.LessThan, nextToken);
            var pk = TableQuery.GenerateFilterCondition("PartitionKey",
                QueryComparisons.Equal, partitionKey);
            var startsWith = TableQuery.CombineFilters(gte, TableOperators.And, lt);
            var filter = TableQuery.CombineFilters(pk, TableOperators.And, startsWith);
            return filter;
        }

        private async Task<bool> HasRecords<T>(CloudTable table) where T : ITableEntity, new()
        {
            var query = new TableQuery<T>().Take(1);
            var records = await table.ExecuteQueryAsync(query);
            return records.Any();
        }

        private async Task InsertBallotStatusRecords(CloudTable ballotStatus, IEnumerable<BallotStatusEntity> testEntities)
        {
            var lastIndex = -1;
            var groups = testEntities.Select((e, i) => { lastIndex = i; return e; }).GroupBy(e => e.PartitionKey).OrderBy(g => g.Key).ToList();
            var sw = new Stopwatch();

            _logger.LogInformation($"Inserting batches for {groups.Count} partition keys for a total of {lastIndex + 1} entities.");
            var index = 0;
            var recordCount = 0;

            sw.Start();
            while (index < groups.Count)
            {
                var tasks = new List<Task<int>>();
                for (var i = 0; i < 10 && index < groups.Count; i++)
                {
                    var group = groups[index];
                    tasks.Add(InsertBallotStatusForPartitionKey(ballotStatus, group));
                    index += 1;
                }
                var counts = await Task.WhenAll(tasks);
                recordCount += counts.Sum();
            }
            sw.Stop();
            _logger.LogInformation($"Finished inserting batches of tracking data with a total of {recordCount} records inserted after {sw.Elapsed.ToString()}");
        }

        private async Task<int> InsertBallotStatusForPartitionKey(CloudTable ballotStatus, IGrouping<string, BallotStatusEntity> group)
        {
            Func<int, bool> isErrorCode = (code) => code / 100 != 2;
            var subGroups = BreakIntoMaxBatches(group);
            var count = 0;

            foreach (var sub in subGroups)
            {
                var batch = new TableBatchOperation();
                foreach (var status in sub)
                {
                    batch.InsertOrReplace(status);
                }

                var results = await ballotStatus.ExecuteBatchAsync(batch);
                results.Where(tr => isErrorCode(tr.HttpStatusCode)).ToList().ForEach(tr =>
                {
                    lock (_logger)
                    {
                        var request = tr.Result as BallotStatusEntity;
                        _logger.LogWarning($"Error status code for record insert! {tr.HttpStatusCode} - {request?.TrackingId}");
                    }
                });

                lock (_logger)
                {
                    _logger.LogDebug($"Inserted {results.Count} records for PK of {group.Key}");
                }
                count += results.Count;
            }

            return count;
        }

        private CloudTableClient TableClient
        {
            get { return _tableClient.Value; }
        }
    }
}
