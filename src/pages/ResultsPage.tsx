import React from 'react';
import { Spinner, SpinnerSize, Text } from '@fluentui/react';

import ElectionHeader from '../components/ElectionTitle';
import ElectionResults from '../components/ElectionResults';
import { useElectionDescription } from '../data/queries';
import { useLocalization } from '../localization/LocalizationProvider';

export interface ResultsPageProps {}

const ResultsPage: React.FunctionComponent<ResultsPageProps> = () => {
    const { translate } = useLocalization();
    const { data: election, isLoading: electionLoading, isError: electionError } = useElectionDescription();

    if (electionLoading) {
        return <Spinner size={SpinnerSize.large} />;
    } else if (electionError || !election) {
        // TODO: show an error
        return <Text>ERROR</Text>;
    }

    return (
        <>
            <ElectionHeader
                electionName={translate(election.name)}
                startDate={election.start_date}
                endDate={election.end_date}
            />
            <ElectionResults election={election} />
        </>
    );
};

export default ResultsPage;
