import React from 'react';
import { useElectionResults } from '../data/queries';
import { Election } from '../models/election';
import { ElectionResultsSummary } from '../models/tally';
import AsyncContent from './AsyncContent';
import ContestResults from './ContestResults';
import LargeCard from './LargeCard';

const errorMessage = 'Unable to retrieve election results at this time.';

export interface ElectionResultsProps {
    election: Election;
}

/**
 * Render the results of the election
 */
const ElectionResults: React.FunctionComponent<ElectionResultsProps> = ({ election }) => {
    const electionResultsQuery = useElectionResults(election.id);

    return (
        <AsyncContent query={electionResultsQuery} errorMessage={errorMessage}>
            {(results) => {
                const contests = getContests(election, results);
                return (
                    <>
                        {contests.map((contest) => (
                            <LargeCard key={contest.id}>
                                <ContestResults
                                    results={contest.results}
                                    contest={contest.description!}
                                    candidates={election.election_description.candidates}
                                />
                            </LargeCard>
                        ))}
                    </>
                );
            }}
        </AsyncContent>
    );
};

function getContests(election: Election, results: ElectionResultsSummary) {
    const contests = Object.entries(results.election_results)
        .map(([contestId, contestResults]) => ({
            id: contestId,
            results: contestResults,
            description: election.election_description.contests.find((c) => c.object_id === contestId),
        }))
        .filter((c) => !!c.description);
    return contests;
}

export default ElectionResults;
