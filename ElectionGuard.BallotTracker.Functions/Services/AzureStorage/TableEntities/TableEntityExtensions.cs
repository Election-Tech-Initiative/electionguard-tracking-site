using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Newtonsoft.Json;

using ElectionGuard.BallotTracker.Functions.Models;

namespace ElectionGuard.BallotTracker.Functions.Services.AzureStorage.TableEntities
{
    public static class TableEntityExtensions
    {
        public static BallotStatusEntity ToBallotStatusEntity(this BallotStatus status)
        {
            if (status is null) return null;

            var rowKey = status.ToBallotStatusRowKey();

            return new BallotStatusEntity
            {
                RowKey = rowKey,
                PartitionKey = rowKey.ToBallotStatusPartitionKey(),
                TrackingId = status.TrackingId,
                ApproximateCastTime = status.ApproximateCastTime,
                Location = status.Location
            };
        }

        public static string ToBallotStatusRowKey(this BallotStatus ballotStatus)
        {
            return ballotStatus?.TrackingId.ToBallotStatusKeyFormat();
        }

        public static string ToBallotStatusKeyFormat(this string pattern)
        {
            var keyFormat = pattern?.Replace(" ", string.Empty)
                                   .Replace("-", string.Empty)
                                   .ToLowerInvariant();
            return keyFormat;
        }

        public static string ToBallotStatusPartitionKey(this string pattern)
        {
            // Prevent any spaces in the partition key.  For example, with:
            // ox 2xf8 blade
            // The partition key should be "ox2"
            var testPattern = pattern.ToBallotStatusKeyFormat();
            if (string.IsNullOrWhiteSpace(testPattern) || testPattern.Length < BallotStatusEntity.MinKeyLength)
                return null;
            return testPattern.Substring(0, BallotStatusEntity.MinKeyLength);
        }

        public static ElectionSummaryEntity ToElectionSummaryEntity(this ElectionSummary summary)
        {
            if (summary is null) return null;

            var json = JsonConvert.SerializeObject(summary.BallotEntries);
            var orderedJson = JsonConvert.SerializeObject(summary.ToOrderedSummary().BallotEntries);
            return new ElectionSummaryEntity
            {
                IsComplete = true,
                PartitionKey = AzTableStorageElectionResultsRepository.ElectionSummaryPartitionKey,
                RowKey = AzTableStorageElectionResultsRepository.ElectionSummaryRowKey,
                BallotEntries = json,
                OrderedBallotEntries = orderedJson
            };
        }

        public static ElectionSummary ToElectionSummary(this ElectionSummaryEntity entity)
        {
            if (entity is null) return null;

            var summary = new ElectionSummary
            {
                IsComplete = entity.IsComplete,
                BallotEntries = JsonConvert.DeserializeObject<List<BallotEntry>>(entity.OrderedBallotEntries ?? entity.BallotEntries)
            };

            if (string.IsNullOrWhiteSpace(entity.OrderedBallotEntries))
            {
                summary.SortTallies();
            }

            return summary;
        }

        private static void SortTallies(this ElectionSummary summary)
        {
            if (summary?.BallotEntries == null) return;

            foreach (var entry in summary.BallotEntries)
            {
                entry.Tallies = entry.Tallies.OrderByDescending(t => t.VoteCount);
            }
        }

        private static ElectionSummary ToOrderedSummary(this ElectionSummary summary)
        {
            if (summary is null) return null;

            // This is a quick way to make a deep copy.  We may want to look at automapper
            // and converting the extension methods to a service so that Automapper can be injected
            // into the service and used.  For now, just a quick serialization and deserialization
            // does the trick without having to worry about specific columns
            var serialized = JsonConvert.SerializeObject(summary);
            var copy = JsonConvert.DeserializeObject<ElectionSummary>(serialized);
            copy.SortTallies();
            return copy;
        }
    }
}
