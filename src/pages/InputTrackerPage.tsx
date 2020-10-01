import React from 'react';
import { Text } from '@fluentui/react';
import ElectionHeader from '../components/ElectionTitle';
import LargeCard from '../components/LargeCard';

const electionName = 'Mock Election';
const startDate = '2020-03-01T08:00:00-05:00';
const endDate = '2020-10-01T08:00:00-05:00';

export interface InputTrackerPageProps {}

const InputTrackerPage: React.FunctionComponent<InputTrackerPageProps> = () => {
    return (
        <>
            <ElectionHeader electionName={electionName} startDate={startDate} endDate={endDate} />
            <LargeCard>
                <Text as="h2">Tracking</Text>
            </LargeCard>
        </>
    );
};

export default InputTrackerPage;
