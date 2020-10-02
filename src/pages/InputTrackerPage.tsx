import React from 'react';
import { useHistory } from 'react-router-dom';
import { Label, PrimaryButton, SearchBox } from '@fluentui/react';

import ElectionHeader from '../components/ElectionTitle';
import LargeCard from '../components/LargeCard';

const electionName = 'Mock Election';
const startDate = '2020-03-01T08:00:00-05:00';
const endDate = '2020-10-01T08:00:00-05:00';

export interface InputTrackerPageProps {}

const InputTrackerPage: React.FunctionComponent<InputTrackerPageProps> = () => {
    const history = useHistory();

    const goToResults = () => {
        history.push('/results');
    };

    return (
        <>
            <ElectionHeader electionName={electionName} startDate={startDate} endDate={endDate} />
            <LargeCard alignToStart>
                <Label>Ballot Search</Label>
                <SearchBox styles={{ root: { width: '100%', maxWidth: 600 } }} placeholder="Input Ballot Tracker" />
                <Label>Election Results</Label>
                <PrimaryButton styles={{ root: { width: '100%', maxWidth: 150 } }} onClick={goToResults}>
                    View
                </PrimaryButton>
            </LargeCard>
        </>
    );
};

export default InputTrackerPage;
