import React from 'react';
import { Text } from '@fluentui/react';
import { HorizontalBarChart } from '@uifabric/charting';
import { useTheme } from '@fluentui/react-theme-provider';
import sum from 'lodash/sum';

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
    const total = sum(tallies) || 1;

    const sortedCandidates = [...candidates].sort((a, b) => b.tally - a.tally);

    return (
        <>
            <Text variant="xLarge">{title}</Text>
            {sortedCandidates.map((candidate) => (
                <CandidateChart key={candidate.id} data={candidate} total={total} />
            ))}
        </>
    );
};

interface CandidateChartProps {
    data: CandidateChartData;
    total: number;
}

/**
 * Internal implementation detail of ContestChart.
 * Renders a single bar representing one candidate in the overall Contest
 */
const CandidateChart: React.FunctionComponent<CandidateChartProps> = ({ data, total: totalTally }) => {
    const theme = useTheme();
    return (
        <HorizontalBarChart
            hideTooltip
            barHeight={30}
            styles={{ items: { height: 60 }, chart: { height: 60 } }}
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
