import React from 'react';

import ElectionHeader from '../components/ElectionTitle';
import ElectionResults from '../components/ElectionResults';
import { useElectionDescription, useElectionResults } from '../data/queries';
import { useLocalization } from '../localization/LocalizationProvider';
import AsyncContent from '../components/AsyncContent';

export interface ResultsPageProps {}

const ResultsPage: React.FunctionComponent<ResultsPageProps> = () => {
    const { translate } = useLocalization();
    const electionQuery = useElectionDescription();

    const electionId = electionQuery.data?.election_scope_id || '';
    const electionResultsQuery = useElectionResults(electionId);

    return (
        <AsyncContent query={electionQuery} errorMessage="Unable to load the election at this time.">
            {(election) => (
                <>
                    <ElectionHeader
                        electionName={translate(election.name)}
                        startDate={election.start_date}
                        endDate={election.end_date}
                    />
                    <ElectionResults election={election} electionResultsQuery={electionResultsQuery} />
                </>
            )}
        </AsyncContent>
    );
};

export default ResultsPage;
