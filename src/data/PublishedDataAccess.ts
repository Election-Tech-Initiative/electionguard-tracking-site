import path from 'path';
import { Election, ElectionDescription } from '../models/election';
import {
    CiphertextAcceptedBallot,
    PlaintextTally,
    transformBallotForTracking,
    transformTallyResults,
} from '../models/electionguard';
import { ElectionResultsSummary } from '../models/tally';
import { TrackedBallot } from '../models/tracking';
import { DataAccess } from './DataAccess';

/**
 * DataAccess implementation for static published ElectionGuard data.
 */
export class PublishedDataAccess implements DataAccess {
    async getElections(): Promise<Election[]> {
        const electionDescription = await loadPublishedFile<ElectionDescription>('description.json');
        const election: Election = {
            id: electionDescription.election_scope_id,
            election_description: electionDescription,
            state: 'Published',
        };
        return [election];
    }

    async getElectionResults(electionId: string): Promise<ElectionResultsSummary> {
        const tally = await loadPublishedFile<PlaintextTally>('tally.json');

        return transformTallyResults(electionId, tally);
    }

    async searchBallots(electionId: string, query: string): Promise<TrackedBallot[]> {
        if (query) {
            const ballotData = await loadPublishedFile<CiphertextAcceptedBallot[]>('encrypted_ballots.json');
            const allBallots = ballotData.map((ballot) => transformBallotForTracking(electionId, ballot));
            return allBallots.filter((ballot) => ballot.tracker_words_for_search.startsWith(query));
        } else {
            return [];
        }
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
