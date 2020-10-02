import { ElectionDescription, ElectionResultsSummary, TrackedBallot } from '../models';

/**
 * Provides access to election data and search functionality.
 */
export interface DataAccess {
    getElectionDescription(): Promise<ElectionDescription>;
    getElectionResults(electionId: string): Promise<ElectionResultsSummary>;
    searchBallots(electionId: string, query: string): Promise<TrackedBallot[]>;
}
