import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import Title, { TitleProps } from './Title';

export default {
    title: 'Components/Title',
    component: Title,
} as Meta;

const Template: Story<TitleProps> = (props) => <Title {...props} />;

export const StandardTitle = Template.bind({});
StandardTitle.storyName = 'Title';
StandardTitle.args = {
    title: 'Title',
};
