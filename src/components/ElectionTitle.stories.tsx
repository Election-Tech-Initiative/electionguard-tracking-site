import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import ElectionTitle, { ElectionTitleProps } from './ElectionTitle';

export default {
    title: 'Components/ElectionTitle',
    component: ElectionTitle,
} as Meta;

const Template: Story<ElectionTitleProps> = (props) => <ElectionTitle {...props} />;

export const StandardElectionTitle = Template.bind({});
StandardElectionTitle.storyName = 'Election Title';
StandardElectionTitle.args = {
    electionName: 'Amazing Election',
    startDate: '2020-03-01T08:00:00-05:00',
    endDate: '2020-03-01T20:00:00-05:00',
};

export const NoNameElectionTitle = Template.bind({});
NoNameElectionTitle.storyName = 'Unnamed Election Title';
NoNameElectionTitle.args = {
    startDate: '2020-03-01T08:00:00-05:00',
    endDate: '2020-03-01T20:00:00-05:00',
};
