/**
 * The complete tallied results of an election.
 *
 * Note that this does not match directly with any core ElectionGuard models,
 * but is a transformed combination of the Election description and Tally results.
 */
export interface ElectionResultsSummary {
    election_id: string;
    election_results: ElectionResults;
}

export interface ElectionResults {
    [contest_id: string]: ContestResults;
}

export interface ContestResults {
    [selection_id: string]: number;
}
