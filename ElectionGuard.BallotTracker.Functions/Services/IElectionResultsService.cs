using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

using ElectionGuard.BallotTracker.Functions.Models;

namespace ElectionGuard.BallotTracker.Functions.Services
{
    public interface IElectionResultsService
    {
        Task<ElectionSummary> GetElectionSummary();

        Task<List<BallotStatus>> GetBallotsMatchingPattern(string pattern);

        Task ImportBallotStatusTrackingData(Stream data);

        Task ImportElectionResults(Stream data);
    }
}