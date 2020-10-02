import path from 'path';

import { ElectionDescription, ElectionResultsSummary, TrackedBallot } from '../models';
import { PlaintextTally, transformTallyResults } from '../models/electionguard';
import { DataAccess } from './DataAccess';

/**
 * DataAccess implementation for static published ElectionGuard data.
 */
export class PublishedDataAccess implements DataAccess {
    getElectionDescription(): Promise<ElectionDescription> {
        return loadPublishedFile('description.json');
    }

    async getElectionResults(electionId: string): Promise<ElectionResultsSummary> {
        const tally = await loadPublishedFile<PlaintextTally>('tally.json');

        return transformTallyResults(electionId, tally);
    }

    searchBallots(query: string): Promise<TrackedBallot[]> {
        throw new Error('Method not implemented.');
    }
}

/**
 * Asynchronously pull a published data file as the requested type.
 */
async function loadPublishedFile<T>(pathInPublished: string): Promise<T> {
    const url = path.join('/published', pathInPublished);

    const fileResponse = await fetch(url);
    const fileContent = await fileResponse.json();

    return fileContent as T;
}
