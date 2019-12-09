using System.IO;
using System.Threading.Tasks;

using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

using ElectionGuard.BallotTracker.Functions.Services;

namespace ElectionGuard.BallotTracker.Functions.DataManagement
{
    public class ElectionDataManagement
    {
        private IElectionResultsService _electionResultsService;

        public ElectionDataManagement(IElectionResultsService electionResultsService)
        {
            _electionResultsService = electionResultsService;
        }

        /// <summary>
        /// Monitors the specified blob container for file updates for the purpose of
        /// updating the table storage with the ballot tracking data.
        /// 
        /// NOTE: Each file will overwrite all existing tracking data in the destination
        /// table storage
        /// NOTE: This trigger will run on any updates of existing files, new files, and
        /// all existing files in the blob container when the function is first created
        /// (this is due to receipt tracking of processed blobs stored in the 
        /// azure-webjobs-hosts container). See:
        /// https://stackoverflow.com/questions/41008374/azure-functions-configure-blob-trigger-only-for-new-events
        /// </summary>
        /// <param name="data">Contents of the uploaded file</param>
        /// <param name="filename">The name of the uploaded file</param>
        /// <param name="logger">Interface for writing logs</param>
        [FunctionName("ImportElectionTrackingIds")]
        public async Task ImportTrackingDataOnBlobUpdate([BlobTrigger("%BallotTrackingContainerName%/{filename}", Connection = "BallotTrackerStorage")]
                        Stream data,
                        string filename,
                        ILogger logger)
        {
            logger.LogInformation($"ImportElectionTrackingIds: Blob trigger function processed blob\n Name:{filename} \n Size: {data.Length} Bytes");
            await _electionResultsService.ImportBallotStatusTrackingData(data);
        }

        /// <summary>
        /// Monitors the specified blob container for file updates for the purpose of
        /// updating the table storage with election results
        ///
        /// NOTE: Each file will overwrite all existing results data.
        /// <param name="data">Contents of the uploaded file</param>
        /// <param name="filename">The name of the uploaded file</param>
        /// <param name="logger">Interface for writing logs</param>
        [FunctionName("ImportElectionResults")]
        public async Task ImportResultsOnBlobUpdate([BlobTrigger("%ElectionResultsContainerName%/{filename}", Connection = "BallotTrackerStorage")]
                        Stream data,
                        string filename,
                        ILogger logger)
        {
            logger.LogInformation($"ImportElectionResults: Blob trigger function processed blob\n Name:{filename} \n Size: {data.Length} Bytes");
            await _electionResultsService.ImportElectionResults(data);
        }
    }
}
