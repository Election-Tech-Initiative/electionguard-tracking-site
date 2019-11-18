using System.Collections.Generic;

namespace ElectionGuard.BallotTracker.Functions.Models
{
    public class ElectionSummary
    {
        public bool IsComplete { get; set; }

        public IEnumerable<BallotEntry> BallotEntries { get; set; }
    }
}
