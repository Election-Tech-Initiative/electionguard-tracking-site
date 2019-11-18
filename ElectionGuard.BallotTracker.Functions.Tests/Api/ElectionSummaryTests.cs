using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using ElectionGuard.BallotTracker.Functions.Models;
using System.Linq;

namespace ElectionGuard.BallotTracker.Functions.Tests.Api
{
    [TestClass]
    public class ElectionSummaryTests
    {
        [TestMethod]
        public async Task GetElectionSummary_ReturnDefaultSummary()
        {
            var request = TestFactory.CreateHttpRequest();
            var logger = TestFactory.CreateLogger();
            var svc = TestFactory.CreateElectionResultsService();
            var response = (JsonResult)await new Functions.Api.ElectionSummary(svc.Object).GetElectionSummary(request, logger);
            var summary = response.Value as Models.ElectionSummary;

            Assert.IsNotNull(summary);
            Assert.IsFalse(summary.IsComplete);
        }

        [TestMethod]
        public async Task GetElectionSummary_ReturnElectionResults()
        {
            var request = TestFactory.CreateHttpRequest();
            var logger = TestFactory.CreateLogger();
            var svc = TestFactory.CreateElectionResultsService(summary: new Models.ElectionSummary
            {
                IsComplete = true,
                BallotEntries = new List<BallotEntry>
                {
                    new BallotEntry
                    {
                        RaceId = "race1",
                        Name = "representative 1",
                        Tallies = new List<Tally>
                        {
                            new Tally
                            {
                                Name = "candidate 1",
                                SelectionId = "candidate1",
                                Party = "party1",
                                VoteCount = 20
                            },
                            new Tally
                            {
                                Name = "candidate 2",
                                SelectionId = "candidate2",
                                Party = "party2",
                                VoteCount = 85
                            }
                        }
                    },
                    new BallotEntry
                    {
                        RaceId = "race2",
                        Name = "senate 1",
                        Tallies = new List<Tally>
                        {
                            new Tally
                            {
                                Name = "candidate 3",
                                SelectionId = "candidate3",
                                Party = "party1",
                                VoteCount = 40
                            },
                            new Tally
                            {
                                Name = "candidate 4",
                                SelectionId = "candidate4",
                                Party = "party2",
                                VoteCount = 65
                            }
                        }
                    },

                }
            });
            var response = (JsonResult)await new Functions.Api.ElectionSummary(svc.Object).GetElectionSummary(request, logger);
            var summary = response.Value as Models.ElectionSummary;

            Assert.IsNotNull(summary);
            Assert.IsTrue(summary.IsComplete);
            Assert.AreEqual(2, summary.BallotEntries.Count());
        }
    }
}
