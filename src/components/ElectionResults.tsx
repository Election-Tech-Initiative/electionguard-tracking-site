import { Spinner, SpinnerSize, Text } from '@fluentui/react';
import React from 'react';
import { useElectionResults } from '../data/queries';
import { ElectionDescription } from '../models';
import ContestResults from './ContestResults';
import LargeCard from './LargeCard';

export interface ElectionResultsProps {
    election: ElectionDescription;
}

/**
 * Render the results of the election
 */
const ElectionResults: React.FunctionComponent<ElectionResultsProps> = ({ election }) => {
    const { data: results, isLoading: resultsLoading, isError: resultsError } = useElectionResults(
        election.election_scope_id
    );

    if (resultsLoading) {
        return <Spinner size={SpinnerSize.large} />;
    } else if (resultsError || !results) {
        // TODO: show error
        return <Text>ERROR</Text>;
    }

    const contests = Object.entries(results.election_results)
        .map(([contestId, contestResults]) => ({
            id: contestId,
            results: contestResults,
            description: election.contests.find((c) => c.object_id === contestId),
        }))
        .filter((c) => !!c.description);

    return (
        <>
            {contests.map((contest) => (
                <LargeCard key={contest.id}>
                    <ContestResults
                        results={contest.results}
                        contest={contest.description!}
                        candidates={election.candidates}
                    />
                </LargeCard>
            ))}
        </>
    );
};

export default ElectionResults;
