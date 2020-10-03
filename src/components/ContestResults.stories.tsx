import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import ContestResults from './ContestResults';

import electionDescription from '../mocks/description.json';
import tally from '../mocks/tally.json';
import { transformTallyResults } from '../models/electionguard';

const electionResults = transformTallyResults('fake-election', tally);
const contestIds = Object.keys(electionResults.election_results);

export default {
    title: 'Components/ContestResults',
    component: ContestResults,
    argTypes: {
        contestId: {
            name: 'Contest ID',
            control: { type: 'select', options: contestIds, disable: false },
        },
    },
} as Meta;

interface StoryArgs {
    contestId: string;
}

const Template: Story<StoryArgs> = ({ contestId }) => (
    <ContestResults
        results={electionResults.election_results[contestId]}
        contest={electionDescription.contests.filter((contest) => contest.object_id === contestId)[0]}
        candidates={electionDescription.candidates}
    />
);

export const Standard = Template.bind({});
Standard.storyName = 'Render Contest results';
Standard.args = {
    contestId: contestIds[0],
};
