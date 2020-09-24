import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import { Contest } from './Contest';

import * as election_description from '../mocks/description.json';
import * as tally from '../mocks/tally.json';

export default {
    title: 'Examples/Contest',
    component: Contest,
} as Meta;

export const Standard: Story = () => (
    <Contest
        contest={tally.contests['congress-district-5-contest']}
        description={
            election_description.contests.filter((contest) => (contest.object_id = 'congress-district-5-contest'))[0]
        }
        candidates={election_description.candidates}
    />
);
