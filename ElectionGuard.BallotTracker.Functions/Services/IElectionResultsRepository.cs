using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using ElectionGuard.BallotTracker.Functions.Models;

namespace ElectionGuard.BallotTracker.Functions.Services
{
    public interface IElectionResultsRepository
    {
        Task<List<BallotStatus>> GetBallotStatusForTokenPattern(string tokenPattern);

        Task<ElectionSummary> GetElectionSummary();

        Task ImportBallotStatusTrackingData(IEnumerable<BallotStatus> ballotStatuses, bool onlyIfEmpty = false);

        Task ImportElectionResultsData(ElectionSummary electionSummary);
    }
}
