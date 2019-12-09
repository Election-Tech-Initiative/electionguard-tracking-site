using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

using ElectionGuard.BallotTracker.Functions.Api;
using ElectionGuard.BallotTracker.Functions.DataManagement;
using ElectionGuard.BallotTracker.Functions.Logging;

namespace ElectionGuard.BallotTracker.Functions.Tests.Logging
{
    [TestClass]
    public class LoggingExtensionsTests
    {
        [TestMethod]
        public void LoggingExtensionse_CreatesLoggerWithCategory()
        {
            var factory = new Mock<ILoggerFactory>();
            var name = GetName<ElectionDataManagement>();

            factory.Setup(f => f.CreateLogger(It.IsAny<string>()))
                   .Callback<string>(category => Assert.AreEqual(name, category));

            factory.Object.CreateAzureFunctionLogger<ElectionDataManagement>();
            factory.Verify(f => f.CreateLogger(name), Times.Once);

            name = GetName<ElectionSummary>();
            factory.Object.CreateAzureFunctionLogger<ElectionSummary>();
            factory.Verify(f => f.CreateLogger(name), Times.Once);
        }

        private string GetName<T>()
        {
            var type = typeof(T);
            return $"Function.{type.Name}.User";
        }
    }
}
