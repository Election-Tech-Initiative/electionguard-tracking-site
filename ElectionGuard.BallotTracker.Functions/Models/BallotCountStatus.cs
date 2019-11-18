using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElectionGuard.BallotTracker.Functions.Models
{
    public enum BallotCountStatus
    {
        NotCounted = 0,
        Counted = 1,
        Spoiled = 2
    }
}
