namespace ElectionGuard.BallotTracker.Functions.Models
{
    public class Tally
    {
        public string SelectionId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Party { get; set; }

        public int VoteCount { get; set; }
    }
}