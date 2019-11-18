using System.Collections.Generic;

namespace ElectionGuard.BallotTracker.Functions.Models
{
    public class BallotEntry
    {
        public string RaceId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public IEnumerable<Tally> Tallies { get; set; }
    }
}
