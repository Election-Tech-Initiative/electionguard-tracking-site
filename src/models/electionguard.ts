import { ContestResults, ElectionResults, ElectionResultsSummary } from '.';

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
