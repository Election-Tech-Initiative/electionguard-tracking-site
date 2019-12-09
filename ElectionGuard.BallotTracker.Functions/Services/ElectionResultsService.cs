using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

using ElectionGuard.BallotTracker.Functions.Logging;
using ElectionGuard.BallotTracker.Functions.Models;
using ElectionGuard.BallotTracker.Functions.Services.AzureStorage.TableEntities;

namespace ElectionGuard.BallotTracker.Functions.Services
{
    /// <summary>
    /// The service responsible for encapsulating all business logic surrounding
    /// election results other than data storage, such as any specific data transformations,
    /// caching, or error checking.
    /// </summary>
    public class ElectionResultsService : IElectionResultsService
    {
        private Lazy<IElectionResultsRepository> _resultsRepository;
        private IHostingEnvironment _environment;
        private IDataParser<BallotStatus> _trackingParser;
        private IDataParser<ElectionSummary> _electionSummaryParser;
        private ILogger _logger;

        public ElectionResultsService(IDataParser<BallotStatus> trackingParser,
                                      IDataParser<ElectionSummary> electionSummaryParser,
                                      IElectionResultsRepository resultsRepository,
                                      IHostingEnvironment environment,
                                      ILoggerFactory factory)
        {
            _logger = factory.CreateAzureFunctionLogger<ElectionResultsService>();
            _resultsRepository = new Lazy<IElectionResultsRepository>(() =>
            {
                if (_environment.IsDevelopment())
                {
                    resultsRepository.ImportBallotStatusTrackingData(GetBallotStatusTestData(), true);
                }
                return resultsRepository;
            });
            _environment = environment;
            _trackingParser = trackingParser;
            _electionSummaryParser = electionSummaryParser;
        }

        public async Task<List<BallotStatus>> GetBallotsMatchingPattern(string pattern)
        {
            return await _resultsRepository.Value.GetBallotStatusForTokenPattern(pattern);
        }

        public async Task<ElectionSummary> GetElectionSummary()
        {
            var summary = await _resultsRepository.Value.GetElectionSummary();
            return summary ?? new ElectionSummary
            {
                IsComplete = false
            };
        }

        public async Task ImportBallotStatusTrackingData(Stream data)
        {
            var statuses = _trackingParser.ParseCsvData(data).ToList();

            // TODO: Refactor the key formatting method into a decoupled utility extension
            // rather than leave it in the TableEntityExtensions class
            var groupedByTrackerId = from s in statuses
                                     group s by s.TrackingId.ToBallotStatusKeyFormat() into g
                                     select new
                                     {
                                         RowKey = g.Key,
                                         Items = (from s in g select s),
                                         Count = g.Count()
                                     };
            var duplicatedIds = groupedByTrackerId.Where(group => group.Count > 1).ToList();
            if (duplicatedIds.Any())
            {
                throw new InvalidOperationException("The uploaded data contained entries with the same normalized tracking ids");
            }
            await _resultsRepository.Value.ImportBallotStatusTrackingData(statuses);
        }

        public async Task ImportElectionResults(Stream data)
        {
            var results = _electionSummaryParser.ParseCsvData(data);
            await _resultsRepository.Value.ImportElectionResultsData(results?.First());
        }

        private IEnumerable<BallotStatus> GetBallotStatusTestData()
        {
            var testData = @"stealth JHMWC frog 7T2X4 ox 7P8QG copper KPCVC exterior CJHWF basics JRBG6 civilisation 7Y8RG accordance|7/5/2019 10:43|Precinct 1
                        shipyard JTGDK blood 3YGKK moat 3V9M8 brass BHJPB salami MMDYF pot GQ4W6 chord MFHKD moonshine|7/14/2019 13:43|Precinct 1
                        kit 2Y9M3 superiority 3WGW6 garb GYGGG buck MYBYJ sword 2XDYB quart JQ9GJ storage 3G9Y6 flanker|6/9/2019 16:17|Precinct 1
                        ox 2XMXF flanker 3KMMJ sunlamp GTGC6 sympathy 6Y7XB piety BRFKC swanling 7XJY7 forecast CDKV3 happening|7/15/2019 8:08|Precinct 1
                        legitimacy 8YFV9 bobcat KWMWK tachometer 4Y7V4 gigantism KWJQ6 ophthalmologist 8XGRB memorial 6W7K9 lightning 2HFYJ being|6/18/2019 7:53|Precinct 1
                        modernist 2QGCH matchmaker KDGD6 grit KY9V4 matrix GQ9VH castle HKJH4 ratepayer MT8XG testing CW8PD attempt|6/15/2019 18:50|Precinct 1
                        luxury 3F9KJ tell FQ8W9 charity MPHXB playground MY6RM ruling 6M9WB fine JVBWG major-league 4XFVG landscape|6/29/2019 19:08|Precinct 2
                        subcomponent DVFRC poet BWMKM conscience DX8X9 compost FW3W4 factor 9JMMH fraud MXJYM file DHJGD expose|6/13/2019 14:52|Precinct 2
                        scalp DXCX4 pork KJMF9 microwave HTGXJ havoc BHBY8 microwave 4QBF9 outlaw 7V3YC seaside FJKMK charity|6/11/2019 9:51|Precinct 2
                        picnic 7RCRK strike BQ6M8 storyboard HVJQ9 intestine 2WMM2 duel CT6XG ideal 9H9MC similarity KR2K3 gyro|7/7/2019 15:32|Precinct 2
                        lily 8MBYC speed KJJG8 ping 6VFXD southeast FK2F4 squash GYBT2 tendency KH7R9 spank GG9R4 abbey|6/8/2019 11:22|Precinct 2
                        papaya 4YJKH swanling KPKD6 platform KVHFC mill JVMF7 screw-up 9K4M7 terrace KXFW9 flanker FRMVB stability|6/13/2019 21:31|Precinct 2
                        nonconformist 7TCYB insolence DXFR2 index KPMMK papaya 4TGM4 stitcher 3Y3D4 oversight BGMFG president 4DMDJ goggles|6/1/2019 17:06|Precinct 2
                        stew MPBQ8 annual KMKQJ mystery 3W8RF ideal JPHG8 commotion BWKMG raincoat 3GFYM papaya FYJX9 jeep|6/7/2019 20:04|Precinct 2
                        ratepayer DRMTG spoon 6XBJJ optimization GH3HJ ophthalmologist FT9KF assistance 4XJQB latex DC6DG dome 7V7YB pillar|6/14/2019 15:55|Precinct 2
                        neglect 7RBWD eyelid 6TDH9 photograph CDBGD software 4K4M2 millstone GTDX4 calf GR8VH tassel JQHCM safe|7/14/2019 8:49|Precinct 2
                        orient MXBWG ham BJ6JC back - up HPGGD firm 9J3YD septicaemia DRJX9 limo JWDKF cribbage 3J2WG mainland|7/1/2019 10:09|Precinct 2
                        itinerary GQFGF economics 7D3GH pentagon HX9XJ pain GDKYG evaluation 2MMKH shearling 8YHX8 highland CY7Y6 subtitle|6/4/2019 10:13|Precinct 2
                        role 2VMX8 sandal DV7V4 past CVGG3 lamp 8P8R9 marble 2J7WJ hybridisation 2JDQ8 pot FX8V4 enclave|7/6/2019 8:47|Precinct 2
                        pause MFKYD tapioca BQ6D4 larva 8MJQG offer 6DDYJ shallot HM9FC hardboard GQCG4 saw FJDDJ president|6/29/2019 15:58|Precinct 2
                        mustache 2RDP8 larva JKMY6 injunction BCDHM outlaw MCJY6 administration MCMF9 browsing KHKQC redesign KTJW9 hospitalisation|6/11/2019 8:54|Precinct 2
                        profile 6KJFB geyser DR8QG checkroom KXMQ3 mystery 4RBKH poet BQ9CK spouse FVKJK sandal DHMT9 compensation|7/11/2019 18:01|Precinct 2
                        fine BJDX6 pot 4F4Y6 pike CCMQB netsuke 6TDRG cilantro 8WFWG sloth HWJMJ sunlamp FR9RK residue|6/4/2019 13:15|Precinct 2
                        opportunity 9HKMH confectionery 4P8W2 sleeping KMGKB size HQJP7 odometer FJMJH cord MY8JK fat 9MKRF pick|7/6/2019 21:25|Precinct 2
                        matchmaker MTKTC neglect 8PGTK energy BYMFC tag HV8KC stalk 9JHG9 penicillin GG6XF space CW4YG couple|6/19/2019 13:54|Precinct 2
                        spoon 3HDK2 squash MP3T6 cot GKMYD president BH9QB creditor JRBX8 thirst 7M6R3 synonym JRJMH horseradish|7/9/2019 7:30|Precinct 2";

            var parsed = _trackingParser.ParseCsvData(new MemoryStream(Encoding.ASCII.GetBytes(testData)));
            return parsed;
        }
    }
}
