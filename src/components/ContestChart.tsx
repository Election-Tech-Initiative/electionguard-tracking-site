import React from 'react';
import { Text } from '@fluentui/react';
import { HorizontalBarChart } from '@uifabric/charting';

export interface ContestChartProps {
    /** The title to display for the contest chart */
    title: string;
    /** The results of each selection */
    selections: SelectionChartData[];
}

export interface SelectionChartData {
    /** The unique ID of the selection */
    id: string;
    /** The title to display for the selection */
    title: string;
    /** The total tallied votes */
    tally: number;
}

/**
 * Displays the results of a tallied contest as a horizontal bar chart.
 */
const ContestChart: React.FunctionComponent<ContestChartProps> = ({ title, selections }) => {
    const tallies = selections.map((selection) => selection.tally);
    const maxTally = Math.max(...tallies) || 1;

    const sortedSelections = [...selections].sort((a, b) => b.tally - a.tally);

    return (
        <>
            <Text variant="xLarge">{title}</Text>
            {sortedSelections.map((selection) => (
                <SelectionChart key={selection.id} data={selection} maxTally={maxTally} />
            ))}
        </>
    );
};

interface SelectionChartProps {
    data: SelectionChartData;
    maxTally: number;
}

/**
 * Internal implementation detail of ContestChart.
 * Renders a single bar representing one Selection in the overall Contest
 */
const SelectionChart: React.FunctionComponent<SelectionChartProps> = ({ data, maxTally: totalTally }) => {
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
                            color: '#1EA7FD',
                        },
                    ],
                },
            ]}
        />
    );
};

export default ContestChart;
