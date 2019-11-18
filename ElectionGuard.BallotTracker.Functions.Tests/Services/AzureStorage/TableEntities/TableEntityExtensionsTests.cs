using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

using ElectionGuard.BallotTracker.Functions.Models;
using ElectionGuard.BallotTracker.Functions.Services.AzureStorage.TableEntities;
using ElectionGuard.BallotTracker.Functions.Services.AzureStorage;

namespace ElectionGuard.BallotTracker.Functions.Tests.Services.AzureStorage.TableEntities
{
    [TestClass]
    public class TableEntityExtensionsTests
    {
        [TestMethod]
        public void ToBallotStatusEntity_NullBallotStatus()
        {
            BallotStatus status = null;
            Assert.IsNull(status.ToBallotStatusEntity());
        }

        [TestMethod]
        public void ToBallotStatusEntity_ReturnsEntity()
        {
            var status = GetTestBallotStatus();

            var entity = status.ToBallotStatusEntity();
            Assert.IsNotNull(entity);
            Assert.AreEqual(status.TrackingId, entity.TrackingId);
            Assert.AreEqual(3, entity.PartitionKey.Length);
            Assert.AreEqual(status.TrackingId.Substring(0, 3).ToLowerInvariant(), entity.PartitionKey);
            Assert.AreEqual(status.TrackingId.ToLowerInvariant().Replace(" ", "").Replace("-", ""), entity.RowKey);
            Assert.AreEqual(status.ApproximateCastTime, entity.ApproximateCastTime);
            Assert.AreEqual(status.Location, entity.Location);
        }

        [TestMethod]
        public void ToBallotStatusRowKey_NullBallotStatus()
        {
            BallotStatus status = null;
            Assert.IsNull(status.ToBallotStatusRowKey());
        }

        [TestMethod]
        public void ToBallotStatusRowKey_ReturnsRowKey()
        {
            var status = GetTestBallotStatus();
            var expected = "trackid1";
            Assert.AreEqual(expected, status.ToBallotStatusRowKey());
        }

        [TestMethod]
        public void ToBallotStatusKeyFormat_ReturnsNullForNullPattern()
        {
            string pattern = null;
            Assert.IsNull(pattern.ToBallotStatusKeyFormat());
        }

        [TestMethod]
        public void ToBallotStatusKeyFormat_ReturnsKey()
        {
            string pattern = "HELlo";
            Assert.AreEqual("hello", pattern.ToBallotStatusKeyFormat());
        }

        [TestMethod]
        public void ToBallotStatusKeyFormat_ReturnsKeyWithoutSpace()
        {
            string pattern = "HEL lo";
            Assert.AreEqual("hello", pattern.ToBallotStatusKeyFormat());
        }

        [TestMethod]
        public void ToBallotStatusKeyFormat_ReturnsKeyWithoutHyphen()
        {
            string pattern = "HEL-lo";
            Assert.AreEqual("hello", pattern.ToBallotStatusKeyFormat());
        }

        [TestMethod]
        public void ToBallotStatusKeyFormat_ReturnsKeyWithoutSpaceOrHyphen()
        {
            string pattern = "HEL lo-world";
            Assert.AreEqual("helloworld", pattern.ToBallotStatusKeyFormat());
        }

        [TestMethod]
        public void ToBallotStatusPartitionKey_ReturnsNullForNullPattern()
        {
            string pattern = null;
            Assert.IsNull(pattern.ToBallotStatusPartitionKey());
        }

        [TestMethod]
        public void ToBallotStatusPartitionKey_ReturnsKey()
        {
            string pattern = "HELlo";
            Assert.AreEqual("hel", pattern.ToBallotStatusPartitionKey());
        }

        [TestMethod]
        public void ToBallotStatusPartitionKey_ReturnsNullIfTooShort()
        {
            string pattern = "HE";
            Assert.IsNull(pattern.ToBallotStatusPartitionKey());
        }

        [TestMethod]
        public void ToElectionSummaryEntity_ReturnsNull()
        {
            ElectionSummary summary = null;
            Assert.IsNull(summary.ToElectionSummaryEntity());
        }

        [TestMethod]
        public void ToElectionSummaryEntity_ReturnsEntity()
        {
            var summary = GetTestElectionSummary();
            var entity = summary.ToElectionSummaryEntity();

            Assert.AreEqual(true, entity.IsComplete);
            Assert.AreEqual(AzTableStorageElectionResultsRepository.ElectionSummaryPartitionKey, entity.PartitionKey);
            Assert.AreEqual(AzTableStorageElectionResultsRepository.ElectionSummaryRowKey, entity.RowKey);

            var json = JsonConvert.SerializeObject(summary.BallotEntries);
            Assert.AreEqual(json, entity.BallotEntries);

            var ordered = JsonConvert.DeserializeObject<List<BallotEntry>>(entity.OrderedBallotEntries);
            var unordered = summary.BallotEntries.First().Tallies.ToList();
            Assert.AreEqual(unordered[0].SelectionId, ordered[0].Tallies.ToList()[1].SelectionId);
            Assert.AreEqual(unordered[1].SelectionId, ordered[0].Tallies.ToList()[0].SelectionId);
        }

        [TestMethod]
        public void ToElectionSummary_ReturnsNullForNullEntity()
        {
            ElectionSummaryEntity entity = null;
            Assert.IsNull(entity.ToElectionSummary());
        }

        [TestMethod]
        public void ToElectionSummary_ReturnsSummary()
        {
            var entity = GetTestElectionSummaryEntity();
            var summary = entity.ToElectionSummary();

            var ordered = JsonConvert.DeserializeObject<List<BallotEntry>>(entity.OrderedBallotEntries);
            var summaryEntries = summary.BallotEntries.First().Tallies.ToList();
            Assert.AreEqual(ordered[0].Tallies.ToList()[0].SelectionId, summaryEntries[0].SelectionId);
            Assert.AreEqual(ordered[0].Tallies.ToList()[1].SelectionId, summaryEntries[1].SelectionId);
        }

        [TestMethod]
        public void ToElectionSummary_ReturnsSummaryWhenEmptyOrderedBallotEntries()
        {
            var entity = GetTestElectionSummaryEntity();
            var orderedEntries = entity.OrderedBallotEntries;
            entity.OrderedBallotEntries = null;
            var summary = entity.ToElectionSummary();

            var ordered = JsonConvert.DeserializeObject<List<BallotEntry>>(orderedEntries);
            var summaryEntries = summary.BallotEntries.First().Tallies.ToList();
            Assert.AreEqual(ordered[0].Tallies.ToList()[0].SelectionId, summaryEntries[0].SelectionId);
            Assert.AreEqual(ordered[0].Tallies.ToList()[1].SelectionId, summaryEntries[1].SelectionId);
        }

        private BallotStatus GetTestBallotStatus()
        {
            var status = new BallotStatus
            {
                TrackingId = "track id 1",
                ApproximateCastTime = DateTime.Parse("1/1/2001"),
                Details = new List<string> { "Counted" },
                Location = "location 1",
                Status = BallotCountStatus.Counted
            };
            return status;
        }

        private ElectionSummaryEntity GetTestElectionSummaryEntity()
        {
            return GetTestElectionSummary().ToElectionSummaryEntity();
        }

        
        private ElectionSummary GetTestElectionSummary()
        {
            var summary = new ElectionSummary
            {
                IsComplete = true,
                BallotEntries = new List<BallotEntry>
                {
                    new BallotEntry
                    {
                        RaceId = "president",
                        Description = "President",
                        Name = "President",
                        Tallies = new List<Tally>
                        {
                            new Tally
                            {
                                SelectionId = "candidate1",
                                Name = "Candidate 1",
                                Description = "Candidate 1",
                                Party = "Party 1",
                                VoteCount = 3
                            },
                            new Tally
                            {
                                SelectionId = "candidate2",
                                Name = "Candidate 2",
                                Description = "Candidate 2",
                                Party = "Party 2",
                                VoteCount = 54
                            }
                        }
                    }
                }
            };
            return summary;
        }
        
    }
}
