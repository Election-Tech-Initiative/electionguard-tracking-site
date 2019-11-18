using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.Azure.Cosmos.Table;

namespace ElectionGuard.BallotTracker.Functions.Services.AzureStorage.TableEntities
{
    public class BallotStatusEntity : TableEntity
    {
        public const int MinKeyLength = 3;

        public string TrackingId { get; set; }

        public string Location { get; set; }

        public DateTime? ApproximateCastTime { get; set; }

        public string Details { get; set; }
    }
}
