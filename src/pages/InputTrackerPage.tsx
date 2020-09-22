import React from 'react';
import { StackItem } from '@fluentui/react';
import Title from '../components/Title';

export interface InputTrackerPageProps {}

const InputTrackerPage: React.FunctionComponent<InputTrackerPageProps> = () => {
    return (
        <StackItem align="center">
            <Title>Ballot Tracking</Title>
        </StackItem>
    );
};

export default InputTrackerPage;
