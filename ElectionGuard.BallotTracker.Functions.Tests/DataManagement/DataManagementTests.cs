using System.Threading.Tasks;

using Microsoft.VisualStudio.TestTools.UnitTesting;

using ElectionGuard.BallotTracker.Functions.DataManagement;
using System.IO;
using Moq;

namespace ElectionGuard.BallotTracker.Functions.Tests.Api
{
    [TestClass]
    public class DataManagementTests
    {
        [TestMethod]
        public async Task ImportTrackingDataOnBlobUpdate_LogsImport()
        {
            var fn = "somefilename.ext";
            var stream = Stream.Null;
            var logger = (ListLogger) TestFactory.CreateLogger(LoggerTypes.List);
            var svc = TestFactory.CreateElectionResultsService();
            await new ElectionDataManagement(svc.Object).ImportTrackingDataOnBlobUpdate(stream, fn, logger);

            Assert.AreEqual(1, logger.Logs.Count);
            var msg = logger.Logs[0];

            Assert.IsTrue(msg.Contains("ImportElectionTrackingIds:"));
            Assert.IsTrue(msg.Contains(fn));
        }

        [TestMethod]
        public async Task ImportTrackingDataOnBlobUpdate_ImportsData()
        {
            var fn = "somefilename.ext";
            var stream = Stream.Null;
            var logger = (ListLogger)TestFactory.CreateLogger(LoggerTypes.List);
            var svc = TestFactory.CreateElectionResultsService();
            await new ElectionDataManagement(svc.Object).ImportTrackingDataOnBlobUpdate(stream, fn, logger);

            svc.Verify(m => m.ImportBallotStatusTrackingData(stream), Times.Once);
        }

        [TestMethod]
        public async Task ImportResultsOnBlobUpdate_LogsImport()
        {
            var fn = "somefilename.ext";
            var stream = Stream.Null;
            var logger = (ListLogger)TestFactory.CreateLogger(LoggerTypes.List);
            var svc = TestFactory.CreateElectionResultsService();
            await new ElectionDataManagement(svc.Object).ImportResultsOnBlobUpdate(stream, fn, logger);

            Assert.AreEqual(1, logger.Logs.Count);
            var msg = logger.Logs[0];

            Assert.IsTrue(msg.Contains("ImportElectionResults:"));
            Assert.IsTrue(msg.Contains(fn));
        }

        [TestMethod]
        public async Task ImportResultsOnBlobUpdate_ImportsData()
        {
            var fn = "somefilename.ext";
            var stream = Stream.Null;
            var logger = (ListLogger)TestFactory.CreateLogger(LoggerTypes.List);
            var svc = TestFactory.CreateElectionResultsService();
            await new ElectionDataManagement(svc.Object).ImportResultsOnBlobUpdate(stream, fn, logger);

            svc.Verify(m => m.ImportElectionResults(stream), Times.Once);
        }
    }
}
