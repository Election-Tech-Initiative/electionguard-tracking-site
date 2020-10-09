import { Election } from '../models/election';
import { ElectionResultsSummary } from '../models/tally';
import { TrackedBallot } from '../models/tracking';

/**
 * Provides access to election data and search functionality.
 */
export interface DataAccess {
    getElections(): Promise<Election[]>;
    getElectionResults(electionId: string): Promise<ElectionResultsSummary>;
    searchBallots(electionId: string, query: string): Promise<TrackedBallot[]>;
}
