import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import ElectionResults from './ElectionResults';

import electionDescription from '../mocks/description.json';
import { ElectionDescription } from '../models/election';
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
    return <ElectionResults election={electionDescription as ElectionDescription} />;
};

export const Success = Template.bind({});
Success.storyName = 'Election Results loaded';
Success.args = {};
