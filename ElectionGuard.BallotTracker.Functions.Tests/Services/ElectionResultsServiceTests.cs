using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

using ElectionGuard.BallotTracker.Functions.Models;
using ElectionGuard.BallotTracker.Functions.Services;

namespace ElectionGuard.BallotTracker.Functions.Tests.Services
{
    [TestClass]
    public class ElectionResultsServiceTests
    {
        private Mock<IDataParser<BallotStatus>> _trackingParser;
        private Mock<IDataParser<ElectionSummary>> _summaryParser;
        private Mock<IElectionResultsRepository> _repo;
        private Mock<IHostingEnvironment> _hostingEnvironment;
        private Mock<ILoggerFactory> _loggerFactory;

        [TestInitialize]
        public void TestInitialize()
        {
            _trackingParser = TestFactory.CreateTrackingDataParser();
            _summaryParser = TestFactory.CreateElectionResultsDataParser();
            _repo = TestFactory.CreateElectionResultsRepository();
            _hostingEnvironment = TestFactory.CreateHostingEnvironment();
            _loggerFactory = TestFactory.CreateLoggerFactory(LoggerTypes.List);
        }

        [TestMethod]
        public async Task GetBallotMatchingPattern_ReturnsEmptyData()
        {
            var results = await GetService().GetBallotsMatchingPattern("something");
            Assert.IsNotNull(results);
            Assert.AreEqual(0, results.Count);
        }

        [TestMethod]
        public async Task GetBallotMatchingPattern_QueriesRepo()
        {
            await GetService().GetBallotsMatchingPattern("something");
            _repo.Verify(r => r.GetBallotStatusForTokenPattern("something"));
        }

        [TestMethod]
        public async Task GetBallotMatchingPattern_PopulatesRepoWithTestDataIfEmptyWhenInDevelopment()
        {
            _hostingEnvironment = TestFactory.CreateHostingEnvironment("Development");
            _repo.Setup(m => m.ImportBallotStatusTrackingData(It.IsAny<IEnumerable<BallotStatus>>(), It.IsAny<bool>()))
                 .Callback<IEnumerable<BallotStatus>, bool>((statuses, onlyIfEmpty) =>
                 {
                     var list = statuses.ToList();

                     Assert.IsTrue(onlyIfEmpty);
                     var record = list.Single(s =>
                     {
                         return s.TrackingId == "shipyard JTGDK blood 3YGKK moat 3V9M8 brass BHJPB salami MMDYF pot GQ4W6 chord MFHKD moonshine" &&
                                s.Location == "Precinct 1" &&
                                s.ApproximateCastTime == DateTime.Parse("7/14/2019 13:43");
                     });
                 });
            var tp = new TrackingDataParser(_loggerFactory.Object);
            await GetService(trackingParser: tp).GetBallotsMatchingPattern("something");
            _repo.Verify(r => r.GetBallotStatusForTokenPattern("something"), Times.Once);
            _repo.Verify(r => r.ImportBallotStatusTrackingData(It.IsAny<IEnumerable<BallotStatus>>(), true), Times.Once);
        }

        [TestMethod]
        public async Task GetBallotMatchingPattern_DoesNotPopulatesRepoWithTestDataIfEmptyWhenInProduction()
        {
            await GetService().GetBallotsMatchingPattern("something");
            _repo.Verify(r => r.GetBallotStatusForTokenPattern("something"), Times.Once);
            _repo.Verify(r => r.ImportBallotStatusTrackingData(It.IsAny<IEnumerable<BallotStatus>>(), It.IsAny<bool>()), Times.Never);
        }

        [TestMethod]
        public async Task GetElectionSummary_QueriesRepo()
        {
            await GetService().GetElectionSummary();
            _repo.Verify(r => r.GetElectionSummary(), Times.Once);
        }

        [TestMethod]
        public async Task ImportBallotStatusTrackingData_UpdatesRepo()
        {
            var tp = new TrackingDataParser(_loggerFactory.Object);
            _repo.Setup(m => m.ImportBallotStatusTrackingData(It.IsAny<IEnumerable<BallotStatus>>(), It.IsAny<bool>()))
                 .Callback<IEnumerable<BallotStatus>, bool>((statuses, onlyIfEmpty) =>
                 {
                     var list = statuses.ToList();

                     Assert.IsFalse(onlyIfEmpty);
                     Assert.AreEqual(3, list.Count);
                     var record = list.Single(s =>
                     {
                         return s.TrackingId == "stealth" &&
                                s.Location == "location1" &&
                                s.ApproximateCastTime == DateTime.Parse("1/1/2001");
                     });
                 });
            var data = TestFactory.GetTestTrackingDataStream();
            await GetService(trackingParser: tp).ImportBallotStatusTrackingData(data);
            _repo.Verify(r => r.ImportBallotStatusTrackingData(It.IsAny<IEnumerable<BallotStatus>>(), false), Times.Once);
        }

        [TestMethod]
        public async Task ImportBallotStatusTrackingData_ThrowsExceptionOnDupliateTrackingIds()
        {
            var tp = new TrackingDataParser(_loggerFactory.Object);
            var data = TestFactory.GetTestTrackingDataStream(true);

            try
            {
                await GetService(trackingParser: tp).ImportBallotStatusTrackingData(data);
                Assert.Fail("Expected InvalidOperationException");
            }
            catch (InvalidOperationException ex)
            {
                Assert.AreEqual("The uploaded data contained entries with the same normalized tracking ids", ex.Message);
            }

            _repo.Verify(r => r.ImportBallotStatusTrackingData(It.IsAny<IEnumerable<BallotStatus>>(), It.IsAny<bool>()), Times.Never);
        }

        [TestMethod]
        public async Task ImportElectionResults_UpdatesRepo()
        {
            var sp = new ElectionResultsDataParser(_loggerFactory.Object);
            _repo.Setup(m => m.ImportElectionResultsData(It.IsAny<ElectionSummary>()))
                 .Callback<ElectionSummary>(summary =>
                 {

                 });
            var data = TestFactory.GetTestSummaryDataStream();
            await GetService(summaryParser: sp).ImportElectionResults(data);
            _repo.Verify(r => r.ImportElectionResultsData(It.IsAny<ElectionSummary>()), Times.Once);
        }

        private IElectionResultsService GetService(
            IDataParser<BallotStatus> trackingParser = null,
            IDataParser<ElectionSummary> summaryParser = null)
        {
            return new ElectionResultsService(
                trackingParser ?? _trackingParser.Object,
                summaryParser ?? _summaryParser.Object,
                _repo.Object,
                _hostingEnvironment.Object,
                _loggerFactory.Object);
        }
    }
}
