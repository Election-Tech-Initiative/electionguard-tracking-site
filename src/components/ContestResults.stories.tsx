import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import ContestResults from './ContestResults';

import * as election_description from '../mocks/description.json';
import * as tally from '../mocks/tally.json';

const contestIds = Object.keys(tally.contests);

export default {
    title: 'Components/Contest',
    component: ContestResults,
    argTypes: {
        contestId: {
            name: 'Contest ID',
            control: { type: 'select', options: contestIds },
        },
    },
} as Meta;

interface StoryArgs {
    contestId: string;
}

const Template: Story<StoryArgs> = ({ contestId }) => (
    <ContestResults
        contest={(tally as any).contests[contestId]}
        description={election_description.contests.filter((contest) => contest.object_id === contestId)[0]}
        candidates={election_description.candidates}
    />
);

export const Standard = Template.bind({});
Standard.storyName = 'Render Contest results';
Standard.args = {
    contestId: contestIds[0],
};
