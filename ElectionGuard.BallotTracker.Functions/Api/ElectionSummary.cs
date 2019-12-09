using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

using ElectionGuard.BallotTracker.Functions.Services;

namespace ElectionGuard.BallotTracker.Functions.Api
{
    public class ElectionSummary
    {
        private IElectionResultsService _electionResultsService;

        public ElectionSummary(IElectionResultsService electionResultsService)
        {
            _electionResultsService = electionResultsService;
        }

        [FunctionName("ElectionSummary")]
        public async Task<IActionResult> GetElectionSummary(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "summary")] HttpRequest req,
            ILogger log)
        {
            var summary = await _electionResultsService.GetElectionSummary();
            return new JsonResult(summary);
        }
    }
}
