using System;
using System.Collections.Generic;
using System.IO;

using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.Extensions.Logging;

using ElectionGuard.BallotTracker.Functions.Models;
using ElectionGuard.BallotTracker.Functions.Logging;

namespace ElectionGuard.BallotTracker.Functions.Services
{
    public class BallotEntryMap : ClassMap<BallotEntry>
    {
        public BallotEntryMap()
        {
            Map(m => m.RaceId).Index(0);
            Map(m => m.Name).Index(1);
            Map(m => m.Description).Index(1);
        }
    }

    public class TallyMap : ClassMap<Tally>
    {
        public TallyMap()
        {
            Map(m => m.SelectionId).Index(2);
            Map(m => m.Name).Index(3);
            Map(m => m.Description).Index(3);
            Map(m => m.Party).Index(4);
            Map(m => m.VoteCount).Index(5);
        }
    }

    public class ElectionResultsDataParser : IDataParser<ElectionSummary>
    {
        private ILogger _logger;

        public ElectionResultsDataParser(ILoggerFactory factory)
        {
            _logger = factory.CreateAzureFunctionLogger<ElectionResultsDataParser>();
        }

        public IEnumerable<ElectionSummary> ParseCsvData(Stream data)
        {
            using (var sr = new StreamReader(data))
            using (var reader = new CsvReader(sr))
            {
                reader.Configuration.HasHeaderRecord = false;
                reader.Configuration.RegisterClassMap<BallotEntryMap>();
                reader.Configuration.RegisterClassMap<TallyMap>();
                reader.Configuration.Delimiter = "|";
                reader.Configuration.TrimOptions = TrimOptions.Trim;
                reader.Configuration.BadDataFound = HandleBadDataFound;

                try
                {
                    return GetSummariesFromReader(reader);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to read election results data file.  Check format.");
                    return null;
                }
            }
        }

        private static IEnumerable<ElectionSummary> GetSummariesFromReader(CsvReader reader)
        {
            var entries = new Dictionary<string, BallotEntry>();
            while (reader.Read())
            {
                var entry = reader.GetRecord<BallotEntry>();
                if (entries.ContainsKey(entry.RaceId))
                {
                    entry = entries[entry.RaceId];
                }
                else
                {
                    entries.Add(entry.RaceId, entry);
                    entry.Tallies = new List<Tally>();
                }

                // We are assuming that we don't have to error check the input
                // file for now.  There shouldn't be duplicate tallies.
                var tally = reader.GetRecord<Tally>();
                (entry.Tallies as List<Tally>)?.Add(tally);
            }

            var summary = new ElectionSummary
            {
                IsComplete = true,
                BallotEntries = entries.Values
            };

            // Right now, there is only one election summary.  For now, just wrap it
            // in a list so that we can share the interface.
            return new List<ElectionSummary> { summary };
        }

        private void HandleBadDataFound(ReadingContext context)
        {
            _logger.LogError("Bad data found for record {index}: {data}", context.CurrentIndex, context.RawRecord);
        }
    }
}