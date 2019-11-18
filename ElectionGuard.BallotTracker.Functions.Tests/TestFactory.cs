using System.Collections.Generic;
using System.IO;
using System.Text;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Primitives;
using Moq;

using ElectionGuard.BallotTracker.Functions.Services;
using ElectionGuard.BallotTracker.Functions.Models;

namespace ElectionGuard.BallotTracker.Functions.Tests
{
    public class TestFactory
    {
        public static Mock<IDataParser<ElectionSummary>> CreateElectionResultsDataParser(ElectionSummary summary = null)
        {
            var mock = new Mock<IDataParser<ElectionSummary>>();

            mock.Setup(m => m.ParseCsvData(It.IsAny<Stream>()))
                .Returns(() =>
                {
                    var s = summary ?? new ElectionSummary();
                    return new List<ElectionSummary> { s };
                });

            return mock;
        }

        public static Mock<IElectionResultsRepository> CreateElectionResultsRepository(
            List<BallotStatus> matchingBallots = null)
        {
            var mock = new Mock<IElectionResultsRepository>();

            mock.Setup(m => m.GetBallotStatusForTokenPattern(It.IsAny<string>()))
                .ReturnsAsync(() =>
                {
                    return matchingBallots ?? new List<BallotStatus>();
                });

            return mock;
        }

        public static Mock<IElectionResultsService> CreateElectionResultsService(
            List<BallotStatus> trackers = null,
            ElectionSummary summary = null)
        {
            var mock = new Mock<IElectionResultsService>();

            mock.Setup(m => m.GetBallotsMatchingPattern(It.IsAny<string>()))
                .ReturnsAsync(() =>
                {
                    return trackers ?? new List<BallotStatus>();
                });

            mock.Setup(m => m.GetElectionSummary())
                .ReturnsAsync(() =>
                {
                    return summary ?? new ElectionSummary
                    {
                        IsComplete = false
                    };
                });

            return mock;
        }

        public static Mock<IHostingEnvironment> CreateHostingEnvironment(string name = "Production")
        {
            var mock = new Mock<IHostingEnvironment>();

            mock.Setup(m => m.EnvironmentName)
                .Returns(() =>
                {
                    return name;
                });

            return mock;
        }


        public static DefaultHttpRequest CreateHttpRequest()
        {
            var request = new DefaultHttpRequest(new DefaultHttpContext());
            return request;
        }

        public static DefaultHttpRequest CreateHttpRequest(string queryStringKey, string queryStringValue)
        {
            var request = CreateHttpRequest();
            if (!string.IsNullOrWhiteSpace(queryStringKey))
            {
                request.Query = new QueryCollection(CreateDictionary(queryStringKey, queryStringValue));
            }
            return request;
        }

        public static Mock<ILoggerFactory> CreateLoggerFactory(LoggerTypes type = LoggerTypes.Null)
        {
            var mock = new Mock<ILoggerFactory>();
            mock.Setup(m => m.CreateLogger(It.IsAny<string>()))
                .Returns(() =>
                {
                    return CreateLogger(type);
                });
            return mock;
        }

        public static ILogger CreateLogger(LoggerTypes type = LoggerTypes.Null)
        {
            ILogger logger;

            if (type == LoggerTypes.List)
            {
                logger = new ListLogger();
            }
            else
            {
                logger = NullLoggerFactory.Instance.CreateLogger("Null Logger");
            }

            return logger;
        }

        public static Mock<IDataParser<BallotStatus>> CreateTrackingDataParser(List<BallotStatus> trackers = null)
        {
            var mock = new Mock<IDataParser<BallotStatus>>();

            mock.Setup(m => m.ParseCsvData(It.IsAny<Stream>()))
                .Returns(() =>
                {
                    return trackers ?? new List<BallotStatus>();
                });

            return mock;
        }

        public static Stream GetTestSummaryDataStream()
        {
            var csv = @"president|US Television President of the United States|bartlet|Josiah Bartlet|West Wing|17
                        president|US Television President of the United States|meyer|Selina Meyer|Veep|13
                        president|US Television President of the United States|palmer|David Palmer|24|4
                        president|US Television President of the United States|underwood|Claire Underwood|House of Cards|10
                        president|US Television President of the United States|grant|Fitz Grant|Scandal|4
                        president|US Television President of the United States|dalton|Conrad Dalton|Madam Secretary|1
                        president|US Television President of the United States|kirkman|Tom Kirkman|Designated Survivor|1
                        measure-no-election-interference|No Interference with Democratic Elections|yes|Yes||38
                        measure-no-election-interference|No Interference with Democratic Elections|no|No||6
                        measure-gray-market-vulnerabilities|Purchase Gray Market Vulnerabilities|yes|Yes||14
                        measure-gray-market-vulnerabilities|Purchase Gray Market Vulnerabilities|no|No||33
                        measure-no-grid-interference|No Interference With Electrical Grid|yes|Yes||35
                        measure-no-grid-interference|No Interference With Electrical Grid|no|No||14";

            return new MemoryStream(Encoding.ASCII.GetBytes(csv));
        }

        public static Stream GetTestTrackingDataStream(bool withDuplicate = false)
        {
            var csv = @"stealth |1/1/2001|location1
                        sunlamp|2/2/2002|location1
                        enclave|3/3/2003|location2
                        ";

            if (withDuplicate)
            {
                csv += "stealth |1/1/2001|location1";
            }
            return new MemoryStream(Encoding.ASCII.GetBytes(csv));
        }

        private static Dictionary<string, StringValues> CreateDictionary(string key, string value)
        {
            var qs = new Dictionary<string, StringValues>
            {
                { key, value }
            };
            return qs;
        }

    }
}
