using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using ElectionGuard.BallotTracker.Functions.Api;
using ElectionGuard.BallotTracker.Functions.Models;

namespace ElectionGuard.BallotTracker.Functions.Tests.Api
{
    [TestClass]
    public class BallotLookupTests
    {
        [TestMethod]
        public async Task GetMatchingBallotsForPattern_ReturnsMatchingPattern()
        {
            var pattern = "dance";
            var request = TestFactory.CreateHttpRequest("pattern", pattern);
            var logger = TestFactory.CreateLogger();
            var svc = TestFactory.CreateElectionResultsService(new List<BallotStatus>
            {
                new BallotStatus
                {
                    TrackingId = $"{pattern} 6XYBN2 book 5TYN89",
                    ApproximateCastTime = DateTime.Now,
                    Location = "Unit testing",
                    Status = BallotCountStatus.Counted
                }
            });
            var response =(JsonResult) await new BallotLookup(svc.Object).GetMatchingBallotsForPattern(request, pattern, logger);
            var list = response?.Value as List<BallotStatus>;

            Assert.IsNotNull(list);
            Assert.AreEqual(1, list.Count);
            Assert.IsTrue(list[0].TrackingId.StartsWith(pattern));
        }

        [TestMethod]
        public async Task GetMatchingBallotsForPattern_ReturnsEmptyList()
        {
            var pattern = "dance";
            var request = TestFactory.CreateHttpRequest("pattern", pattern);
            var logger = TestFactory.CreateLogger();
            var svc = TestFactory.CreateElectionResultsService();
            var response = (JsonResult)await new BallotLookup(svc.Object).GetMatchingBallotsForPattern(request, pattern, logger);
            var list = response?.Value as List<BallotStatus>;

            Assert.IsNotNull(list);
            Assert.AreEqual(0, list.Count);
        }

        [TestMethod]
        public async Task GetMatchingBallotsForPattern_BadRequestWhenNoPattern()
        {
            var request = TestFactory.CreateHttpRequest();
            var logger = TestFactory.CreateLogger();
            var svc = TestFactory.CreateElectionResultsService();
            var response = (BadRequestObjectResult)await new BallotLookup(svc.Object).GetMatchingBallotsForPattern(request, null, logger);

            Assert.IsNotNull(response);
            Assert.AreEqual((int) HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
