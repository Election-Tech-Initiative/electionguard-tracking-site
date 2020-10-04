import React from 'react';
import { useHistory } from 'react-router-dom';
import { Label, SearchBox, Stack } from '@fluentui/react';

import ElectionHeader from '../components/ElectionTitle';
import LargeCard from '../components/LargeCard';
import { useLocalization } from '../localization/LocalizationProvider';
import { useElectionDescription, useElectionResults } from '../data/queries';
import AsyncContent from '../components/AsyncContent';
import ElectionResults from '../components/ElectionResults';
import TrackerSearch from '../components/TrackerSearch';

export interface ElectionPageProps {}

const ElectionPage: React.FunctionComponent<ElectionPageProps> = () => {
    const { translate } = useLocalization();
    const electionQuery = useElectionDescription();

    const electionId = electionQuery.data?.election_scope_id || '';
    const electionResultsQuery = useElectionResults(electionId);

    return (
        <Stack>
            <AsyncContent query={electionQuery} errorMessage="Unable to load the election at this time.">
                {(election) => (
                    <>
                        <ElectionHeader
                            electionName={translate(election.name)}
                            startDate={election.start_date}
                            endDate={election.end_date}
                        />

                        <TrackerSearch electionId={election.election_scope_id} />

                        <ElectionResults election={election} electionResultsQuery={electionResultsQuery} />
                    </>
                )}
            </AsyncContent>
        </Stack>
    );
};

export default ElectionPage;
