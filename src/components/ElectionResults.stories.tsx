import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import ElectionResults from './ElectionResults';

import electionDescription from '../mocks/description.json';
import { Election } from '../models/election';
import { queryArgTypes, QueryStoryArgs } from '../util/queryStory';

export default {
    title: 'Components/ElectionResults',
    component: ElectionResults,
    argTypes: {
        ...queryArgTypes,
    },
} as Meta;

interface StoryArgs extends QueryStoryArgs {}

const Template: Story<StoryArgs> = ({ queryState }) => {
    var election = {
        id: electionDescription.election_scope_id,
        election_description: electionDescription,
        state: 'Published',
    } as Election;
    return <ElectionResults election={election} />;
};

export const Success = Template.bind({});
Success.storyName = 'Election Results loaded';
Success.args = {};
