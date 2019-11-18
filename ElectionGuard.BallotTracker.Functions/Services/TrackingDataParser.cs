using System;
using System.Collections.Generic;
using System.IO;

using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.Extensions.Logging;

using ElectionGuard.BallotTracker.Functions.Logging;
using ElectionGuard.BallotTracker.Functions.Models;
using System.Linq;

namespace ElectionGuard.BallotTracker.Functions.Services
{
    public class BallotStatusMap : ClassMap<BallotStatus>
    {
        public enum TrackingDataColumnIndexes
        {
            TrackingId = 0,
            ApproximateCastTime = 1,
            Location = 2
        }

        public BallotStatusMap()
        {
            Map(m => m.TrackingId).Index((int) TrackingDataColumnIndexes.TrackingId);
            Map(m => m.Location).Index((int) TrackingDataColumnIndexes.Location);
            Map(m => m.ApproximateCastTime).Index((int) TrackingDataColumnIndexes.ApproximateCastTime);
        }
    }

    public class TrackingDataParser : IDataParser<BallotStatus>
    {
        private ILogger _logger;

        public TrackingDataParser(ILoggerFactory factory)
        {
            _logger = factory.CreateAzureFunctionLogger<TrackingDataParser>();
        }

        public IEnumerable<BallotStatus> ParseCsvData(Stream data)
        {
            // TODO: Abstract this to use a factory and IReader if possible.
            using (var sr = new StreamReader(data))
            using (var reader = new CsvReader(sr))
            {
                reader.Configuration.HasHeaderRecord = false;
                reader.Configuration.RegisterClassMap<BallotStatusMap>();
                reader.Configuration.Delimiter = "|";
                reader.Configuration.TrimOptions = TrimOptions.Trim;
                reader.Configuration.BadDataFound = HandleBadDataFound;
                reader.Configuration.ShouldSkipRecord = ShouldSkipRecord;

                // The records are lazily read as needed from the stream.  This allows
                // the calling code to ultimately only iterate through the list once as it
                // is parsing and mapping data correctly.  If we just return the IEnumerable<T>
                // from the reader.GetRecords<T>() call, the data stream will be cleaned up
                // before the IEnumerable<> is actually iterated on.  Thus, we put a foreach
                // here and yield each record.
                var ballots = reader.GetRecords<BallotStatus>();
                foreach (var b in ballots) yield return b;
            }
        }

        private bool ShouldSkipRecord(string[] arg)
        {
            var shouldSkip = (arg.Length <= 0) ||
                              string.IsNullOrEmpty(arg[(int) BallotStatusMap.TrackingDataColumnIndexes.TrackingId]);
            return shouldSkip;
        }

        private void HandleBadDataFound(ReadingContext context)
        {
            _logger.LogWarning("Bad data found for record {index}: {data}", context.CurrentIndex, context.RawRecord);
        }
    }
}
