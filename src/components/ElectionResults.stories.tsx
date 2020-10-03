import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import ElectionResults from './ElectionResults';

import electionDescription from '../mocks/description.json';

export default {
    title: 'Components/ElectionResults',
    component: ElectionResults,
} as Meta;

const Template: Story = () => <ElectionResults election={electionDescription} />;

export const Standard = Template.bind({});
Standard.storyName = 'Render Election results';
Standard.args = {};
