import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import StatusMessage, { StatusMessageProps } from './StatusMessage';

export default {
    title: 'Components/StatusMessage',
    component: StatusMessage,
} as Meta;

const Template: Story<StatusMessageProps> = (props) => <StatusMessage {...props} />;

export const Success = Template.bind({});
Success.args = {
    message: 'Success',
    icon: 'Completed',
    colorName: 'green',
};

export const Failure = Template.bind({});
Failure.args = {
    message: 'OH NO!',
    icon: 'StatusErrorFull',
    colorName: 'redDark',
};

export const NoIcon = Template.bind({});
NoIcon.storyName = 'No Icon';
NoIcon.args = {
    message: 'Just some text!',
    colorName: 'neutralDark',
};
