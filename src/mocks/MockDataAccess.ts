import { DataAccess } from '../data/DataAccess';

import mockDescription from './description.json';
import mockTally from './tally.json';
import mockBallots from './ballots.json';
import { CiphertextAcceptedBallot, transformBallotForTracking, transformTallyResults } from '../models/electionguard';
import { Election } from '../models/election';
import { ElectionResultsSummary } from '../models/tally';
import { TrackedBallot } from '../models/tracking';

const electionId = mockDescription.election_scope_id;
const trackedBallots = (mockBallots as CiphertextAcceptedBallot[]).map((ballot) =>
    transformBallotForTracking(electionId, ballot)
);

/**
 * DataAccess implementation for in-memory synchronous mocked data
 */
export class MockDataAccess implements DataAccess {
    async getElections(): Promise<Election[]> {
        const mockElection: Election = {
            id: mockDescription.election_scope_id,
            election_description: mockDescription,
            state: 'Published',
        };
        return [mockElection];
    }

    async getElectionResults(electionId: string): Promise<ElectionResultsSummary> {
        const tally = mockTally;
        return transformTallyResults(electionId, tally);
    }

    async searchBallots(electionId: string, query: string): Promise<TrackedBallot[]> {
        return query ? trackedBallots.filter((ballot) => ballot.tracker_words_for_search.startsWith(query)) : [];
    }
}
