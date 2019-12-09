using System.Collections.Generic;

using Microsoft.Azure.Cosmos.Table;

namespace ElectionGuard.BallotTracker.Functions.Services.AzureStorage.TableEntities
{
    public class ElectionSummaryEntity : TableEntity
    {
        public bool IsComplete { get; set; }

        public string BallotEntries { get; set; }

        public string OrderedBallotEntries { get; set; }
    }
}
