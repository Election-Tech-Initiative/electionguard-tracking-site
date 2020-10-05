import React from 'react';
import { Stack } from '@fluentui/react';

import AsyncContent from '../components/AsyncContent';
import ElectionTitle from '../components/ElectionTitle';
import TrackerSearch from '../components/TrackerSearch';
import ElectionResults from '../components/ElectionResults';
import { ElectionDescription } from '../models/election';
import { QueryResult } from '../data/queries';
import { useLocalization } from '../localization/LocalizationProvider';
import { useParams } from 'react-router-dom';
import Title from '../components/Title';

export interface ElectionPageProps {
    electionsQuery: QueryResult<ElectionDescription[]>;
}

const ElectionPage: React.FunctionComponent<ElectionPageProps> = ({ electionsQuery }) => {
    const { electionId } = useParams<{ electionId: string }>();
    const { translate } = useLocalization();

    return (
        <Stack>
            <AsyncContent query={electionsQuery} errorMessage="Unable to load the election at this time.">
                {(elections) => {
                    const election = elections.find((e) => e.election_scope_id === electionId);

                    if (!election) {
                        return <Title title="We're having trouble finding this election. Please try again." />;
                    }

                    return (
                        <>
                            <ElectionTitle
                                electionName={translate(election!.name)}
                                startDate={election!.start_date}
                                endDate={election!.end_date}
                            />

                            <TrackerSearch electionId={election!.election_scope_id} />

                            <ElectionResults election={election!} />
                        </>
                    );
                }}
            </AsyncContent>
        </Stack>
    );
};

export default ElectionPage;
