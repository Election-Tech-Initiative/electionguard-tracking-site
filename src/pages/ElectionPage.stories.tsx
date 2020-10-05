import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import ElectionPage, { ElectionPageProps } from './ElectionPage';

export default {
    title: 'Pages/ElectionPage',
    component: ElectionPage,
} as Meta;

const Template: Story<ElectionPageProps> = (props) => <ElectionPage {...props} />;

export const Page = Template.bind({});
Page.storyName = 'Render Election';
Page.args = {};
