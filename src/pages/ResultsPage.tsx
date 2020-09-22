import React from 'react';
import { StackItem } from '@fluentui/react';
import Title from '../components/Title';

export interface ResultsPageProps {}

const ResultsPage: React.FunctionComponent<ResultsPageProps> = () => {
    return (
        <StackItem align="center">
            <Title>Election Description</Title>
        </StackItem>
    );
};

export default ResultsPage;
