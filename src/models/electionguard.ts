import { ContestResults, ElectionResults, ElectionResultsSummary } from './tally';
import { BallotState, TrackedBallot } from './tracking';

/**
 * @module
 * Defines types specific to the core ElectionGuard implementation,
 * and provides helper functions to translate into the application models.
 */

/**
 * A simple subset of relevant data from a published
 * decrypted tally file.
 */
export interface PlaintextTally {
    contests: {
        [contest_id: string]: {
            selections: {
                [selection_id: string]: {
                    tally: number;
                };
            };
        };
    };
}

/**
 * Convert the raw published ElectionGuard tally into a simplified
 * model for use in the application.
 */
export function transformTallyResults(electionId: string, tally: PlaintextTally): ElectionResultsSummary {
    const results: ElectionResults = {};
    Object.entries(tally.contests).forEach(([contestId, contest]) => {
        const contestResults: ContestResults = {};
        Object.entries(contest.selections).forEach(([selectionId, selection]) => {
            contestResults[selectionId] = selection.tally;
        });
        results[contestId] = contestResults;
    });

    return {
        election_id: electionId,
        election_results: results,
    };
}

/**
 * A simple subset of relevant data from a
 * published encrypted ballot.
 */
export interface CiphertextAcceptedBallot {
    object_id: string;
    tracking_hash: string;
    state: BallotState;
}

export function transformBallotForTracking(electionId: string, ballot: CiphertextAcceptedBallot): TrackedBallot {
    return {
        id: ballot.object_id,
        election_id: electionId,
        state: ballot.state,

        // IMPORTANT!
        // For better user experience in a real world scenario, it's important
        // to convert the raw tracking hash into a tracker code, which is a
        // human-readable collection of words.
        //
        // We provide this function in the electionguard-python library,
        // and wrap it in the electionguard-web-api as well.
        tracker_words: ballot.tracking_hash,
        tracker_words_for_search: ballot.tracking_hash?.replace(/\s+/g, ''),
    };
}
