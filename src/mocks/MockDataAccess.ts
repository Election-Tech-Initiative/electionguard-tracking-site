import { ElectionDescription, ElectionResultsSummary, TrackedBallot } from '../models';
import { transformTallyResults } from '../models/electionguard';
import { DataAccess } from '../data/DataAccess';

import mockDescription from './description.json';
import mockTally from './tally.json';

/**
 * DataAccess implementation for in-memory synchronous mocked data
 */
export class MockDataAccess implements DataAccess {
    async getElectionDescription(): Promise<ElectionDescription> {
        return mockDescription;
    }

    async getElectionResults(electionId: string): Promise<ElectionResultsSummary> {
        const tally = mockTally;
        return transformTallyResults(electionId, tally);
    }

    searchBallots(query: string): Promise<TrackedBallot[]> {
        throw new Error('Method not implemented.');
    }
}
