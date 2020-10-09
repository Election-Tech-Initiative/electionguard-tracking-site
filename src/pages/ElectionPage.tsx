import React from 'react';
import { Stack } from '@fluentui/react';

import AsyncContent from '../components/AsyncContent';
import ElectionTitle from '../components/ElectionTitle';
import ElectionPlaceholderMessage from '../components/ElectionPlaceholderMessage';
import TrackerSearch from '../components/TrackerSearch';
import ElectionResults from '../components/ElectionResults';
import { useElections } from '../data/queries';
import { useLocalization } from '../localization/LocalizationProvider';
import { useParams } from 'react-router-dom';
import Title from '../components/Title';

export interface ElectionPageProps {}

const ElectionPage: React.FunctionComponent<ElectionPageProps> = () => {
    const { electionId } = useParams<{ electionId: string }>();
    const { translate } = useLocalization();
    const electionsQuery = useElections();

    return (
        <Stack>
            <AsyncContent query={electionsQuery} errorMessage="Unable to load the election at this time.">
                {(elections) => {
                    const election = elections.find((e) => e.id === electionId);

                    if (!election) {
                        return <Title title="We're having trouble finding this election. Please try again." />;
                    }

                    return (
                        <>
                            <ElectionTitle
                                electionName={translate(election!.election_description.name)}
                                startDate={election!.election_description.start_date}
                                endDate={election!.election_description.end_date}
                            />
                            {election.state === 'Published' ? (
                                <>
                                    <TrackerSearch electionId={election!.id} />
                                    <ElectionResults election={election!} />
                                </>
                            ) : (
                                <ElectionPlaceholderMessage endDate={election!.election_description.end_date} />
                            )}
                        </>
                    );
                }}
            </AsyncContent>
        </Stack>
    );
};

export default ElectionPage;
