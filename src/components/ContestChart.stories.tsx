import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import ContestChart, { ContestChartProps, SelectionChartData } from './ContestChart';

export default {
    title: 'ContestChart',
    component: ContestChart,
} as Meta;

const Template: Story<ContestChartProps> = (props) => <ContestChart {...props} />;

function makeSampleSelections(tallies: number[]): SelectionChartData[] {
    return tallies.map((tally, index) => ({
        id: index.toString(),
        title: `Candidate ${index + 1}`,
        tally,
    }));
}

export const SmallContest = Template.bind({});
SmallContest.storyName = 'Small Contest';
SmallContest.args = {
    title: 'Small Contest',
    selections: [
        { id: '1', title: 'Larry', tally: 0 },
        { id: '2', title: 'Curly', tally: 2 },
        { id: '3', title: 'Moe', tally: 1 },
    ],
};

export const MediumContest = Template.bind({});
MediumContest.storyName = 'Medium-Sized Contest';
MediumContest.args = {
    title: 'Medium-Sized Contest',
    selections: makeSampleSelections([194, 47, 151, 75, 169, 0, 0, 71, 64, 110, 193, 120, 143, 161, 144]),
};

export const LargeTallies = Template.bind({});
LargeTallies.storyName = 'Contest with Large Tallies';
LargeTallies.args = {
    title: 'Big Election',
    selections: makeSampleSelections([34928172, 29412122, 3723187]),
};

export const LongText = Template.bind({});
LongText.storyName = 'Contest with Long Text';
LongText.args = {
    title: 'A Very Long Contest Name That May Not Fit Nicely On One Line',
    selections: [
        { id: '1', title: 'The First Candidate Who Was Considered By Voters', tally: 0 },
        { id: '2', title: 'The Second Candidate Who Was Considered By Voters', tally: 2 },
        { id: '3', title: 'The Third Candidate Who Was Considered By Voters', tally: 1 },
    ],
};

export const ZeroVote = Template.bind({});
ZeroVote.storyName = 'Contest with No Votes';
ZeroVote.args = {
    title: 'Unpopular Vote',
    selections: makeSampleSelections([0, 0, 0]),
};
