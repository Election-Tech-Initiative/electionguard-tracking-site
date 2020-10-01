import React from 'react';
import { Text } from '@fluentui/react';
import { HorizontalBarChart } from '@uifabric/charting';
import { useTheme } from '@fluentui/react-theme-provider';

export interface ContestChartProps {
    /** The title to display for the contest chart */
    title: string;
    /** The results of each candidate */
    candidates: CandidateChartData[];
}

export interface CandidateChartData {
    /** The unique ID of the candidate */
    id: string;
    /** The title to display for the candidate */
    title: string;
    /** The total tallied votes */
    tally: number;
}

/**
 * Displays the results of a tallied contest as a horizontal bar chart.
 */
const ContestChart: React.FunctionComponent<ContestChartProps> = ({ title, candidates }) => {
    const tallies = candidates.map((candidate) => candidate.tally);
    const maxTally = Math.max(...tallies) || 1;

    const sortedCandidates = [...candidates].sort((a, b) => b.tally - a.tally);

    return (
        <>
            <Text variant="xLarge">{title}</Text>
            {sortedCandidates.map((candidate) => (
                <CandidateChart key={candidate.id} data={candidate} maxTally={maxTally} />
            ))}
        </>
    );
};

interface CandidateChartProps {
    data: CandidateChartData;
    maxTally: number;
}

/**
 * Internal implementation detail of ContestChart.
 * Renders a single bar representing one candidate in the overall Contest
 */
const CandidateChart: React.FunctionComponent<CandidateChartProps> = ({ data, maxTally: totalTally }) => {
    const theme = useTheme();
    return (
        <HorizontalBarChart
            barHeight={20}
            styles={{ items: { height: 50 }, chart: { height: 50 } }}
            data={[
                {
                    chartTitle: data.title,
                    chartData: [
                        {
                            horizontalBarChartdata: { x: data.tally, y: totalTally },
                            color: theme.palette.themePrimary,
                        },
                    ],
                },
            ]}
        />
    );
};

export default ContestChart;
