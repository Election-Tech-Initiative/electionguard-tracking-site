/**
 * Basic, anonymous information about a ballot which has been cast or spoiled,
 * with a unique tracker string.
 */
export interface TrackedBallot {
    /** The unique ElectionGuard ID for the ballot */
    id: string;

    /** The unique ElectionGuard ID for the ballot's election */
    election_id: string;

    /** The cast/spoiled state of the ballot */
    state: BallotState;

    /** The ballot's tracker string, in human-readable words separated by spaces */
    tracker_words: string;

    /** The ballot's tracker string, stripped of whitespace for easier search */
    tracker_words_for_search: string;
}

export type BallotState = 'Cast' | 'Spoiled';
