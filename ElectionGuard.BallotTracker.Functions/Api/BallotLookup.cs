using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

using ElectionGuard.BallotTracker.Functions.Services;

namespace ElectionGuard.BallotTracker.Functions.Api
{
    public class BallotLookup
    {
        private IElectionResultsService _electionResultsService;

        public BallotLookup(IElectionResultsService electionResultsService)
        {
            _electionResultsService = electionResultsService;
        }

        [FunctionName("BallotLookup")]
        public async Task<IActionResult> GetMatchingBallotsForPattern(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "ballot/{pattern}")] HttpRequest req,
            string pattern,
            ILogger log)
        {
            if (pattern != null)
            {
                var ballots = await _electionResultsService.GetBallotsMatchingPattern(pattern);
                return new JsonResult(ballots);
            }
            return new BadRequestObjectResult("Please pass a pattern on the query string or in the request body");
        }
    }
}
