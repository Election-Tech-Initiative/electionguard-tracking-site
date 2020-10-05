import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import ElectionResults from './ElectionResults';

import electionDescription from '../mocks/description.json';
import tally from '../mocks/tally.json';
import { transformTallyResults } from '../models/electionguard';
import { ElectionDescription } from '../models/election';
import { getDummyQueryResult, queryArgTypes, QueryStoryArgs } from '../util/queryStory';

const electionResults = transformTallyResults('fake-election', tally);

export default {
    title: 'Components/ElectionResults',
    component: ElectionResults,
    argTypes: {
        ...queryArgTypes,
    },
} as Meta;

interface StoryArgs extends QueryStoryArgs {}

const Template: Story<StoryArgs> = ({ queryState }) => {
    return (
        <ElectionResults
            election={electionDescription as ElectionDescription}
            electionResultsQuery={getDummyQueryResult(queryState, electionResults)}
        />
    );
};

export const Success = Template.bind({});
Success.storyName = 'Election Results loaded';
Success.args = { queryState: 'success' };

export const Loading = Template.bind({});
Loading.storyName = 'Election Results loading';
Loading.args = { queryState: 'loading' };

export const Error = Template.bind({});
Error.storyName = 'Election Results failed';
Error.args = { queryState: 'error' };
