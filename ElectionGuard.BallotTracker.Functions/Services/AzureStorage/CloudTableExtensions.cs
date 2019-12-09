using System;
using System.Collections.Generic;

using System.Threading;
using System.Threading.Tasks;

using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Table.Protocol;

namespace ElectionGuard.BallotTracker.Functions.Services.AzureStorage
{
    public static class CloudTableExtensions
    {
        public static async Task<IList<T>> ExecuteQueryAsync<T>(this CloudTable table, TableQuery<T> query, CancellationToken ct = default(CancellationToken), Action<IList<T>> onProgress = null) where T : ITableEntity, new()
        {
            // Adapted from answers at: https://stackoverflow.com/questions/24234350/how-to-execute-an-azure-table-storage-query-async-client-version-4-0-1
            var items = new List<T>();
            TableContinuationToken token = null;

            do
            {
                var seg = await table.ExecuteQuerySegmentedAsync<T>(query, token, ct);
                token = seg.ContinuationToken;
                items.AddRange(seg);
                onProgress?.Invoke(items);

            } while (token != null && !ct.IsCancellationRequested &&
                     (query.TakeCount == null || items.Count < query.TakeCount.Value));

            return items;
        }

        public static async Task SafeCreateIfNotExists(this CloudTable table, ILogger _logger)
        {
            const int MaxRetries = 10;
            var retries = 0;

            do
            {
                try
                {
                    await table.CreateIfNotExistsAsync();
                    return;
                }
                catch (StorageException ex)
                {
                    if ((ex.RequestInformation.HttpStatusCode == 409) &&
                        (ex.RequestInformation.ExtendedErrorInformation.ErrorCode == TableErrorCodeStrings.TableBeingDeleted))
                    {
                        retries += 1;
                        _logger.LogInformation($"Table '{table.Name}' is currently being deleted, delaying 20 seconds before retrying: {retries}");
                        await Task.Delay(20000);
                    }
                    else
                    {
                        throw;
                    }
                }
            } while (retries <= MaxRetries);
            _logger.LogError($"Failed to create '{table.Name}' with a max retry count of {retries}");
        }
    }
}
