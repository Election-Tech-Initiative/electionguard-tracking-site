import { DataAccess } from '../data/DataAccess';

import mockDescription from './description.json';
import mockTally from './tally.json';
import mockBallots from './ballots.json';
import { CiphertextAcceptedBallot, transformBallotForTracking, transformTallyResults } from '../models/electionguard';
import { ElectionDescription } from '../models/election';
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
    async getElectionDescription(): Promise<ElectionDescription> {
        return mockDescription as any;
    }

    async getElectionResults(electionId: string): Promise<ElectionResultsSummary> {
        const tally = mockTally;
        return transformTallyResults(electionId, tally);
    }

    async searchBallots(electionId: string, query: string): Promise<TrackedBallot[]> {
        return query ? trackedBallots.filter((ballot) => ballot.tracker_words_for_search.startsWith(query)) : [];
    }
}
