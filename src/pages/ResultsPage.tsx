import React from 'react';
import ElectionHeader from '../components/ElectionTitle';
import LargeCard from '../components/LargeCard';

import ContestChart, { ContestChartProps } from '../components/ContestChart';

const electionName = 'Mock Election';
const startDate = '2020-03-01T08:00:00-05:00';
const endDate = '2020-10-01T08:00:00-05:00';
const results = {
    contests: [
        {
            title: 'Small Contest',
            candidates: [
                { id: '1', title: 'Larry', tally: 0 },
                { id: '2', title: 'Curly', tally: 2 },
                { id: '3', title: 'Moe', tally: 1 },
            ],
        },
        {
            title: 'Small Contest',
            candidates: [
                { id: '1', title: 'Larry', tally: 0 },
                { id: '2', title: 'Curly', tally: 2 },
                { id: '3', title: 'Moe', tally: 1 },
            ],
        },
        {
            title: 'Small Contest',
            candidates: [
                { id: '1', title: 'Larry', tally: 0 },
                { id: '2', title: 'Curly', tally: 2 },
                { id: '3', title: 'Moe', tally: 1 },
            ],
        },
    ],
};

interface ElectionResults {
    contests: ContestChartProps[];
}

export interface ResultsPageProps {
    results: ElectionResults;
}

const ResultsPage: React.FunctionComponent<ResultsPageProps> = () => {
    return (
        <>
            <ElectionHeader electionName={electionName} startDate={startDate} endDate={endDate} />
            {results.contests.map((contest) => (
                <LargeCard>
                    <ContestChart title={contest.title} candidates={contest.candidates} />
                </LargeCard>
            ))}
        </>
    );
};

export default ResultsPage;
