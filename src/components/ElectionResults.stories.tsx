import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import ElectionResults from './ElectionResults';

import electionDescription from '../mocks/description.json';
import { ElectionDescription } from '../models';

export default {
    title: 'Components/ElectionResults',
    component: ElectionResults,
} as Meta;

const Template: Story = () => <ElectionResults election={electionDescription as ElectionDescription} />;

export const Standard = Template.bind({});
Standard.storyName = 'Render Election results';
Standard.args = {};
