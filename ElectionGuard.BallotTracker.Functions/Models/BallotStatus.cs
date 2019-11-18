using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElectionGuard.BallotTracker.Functions.Models
{
    public class BallotStatus
    {
        public string TrackingId { get; set; }

        public BallotCountStatus Status { get; set; }

        public string Location { get; set; }

        public DateTime? ApproximateCastTime { get; set; }

        public IEnumerable<string> Details { get; set; }
    }
}
