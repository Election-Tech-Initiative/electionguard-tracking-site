import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import NotFoundPage, { NotFoundPageProps } from './NotFoundPage';

export default {
    title: 'Pages/NotFoundPage',
    component: NotFoundPage,
} as Meta;

const Template: Story<NotFoundPageProps> = (props) => <NotFoundPage {...props} />;

export const Page = Template.bind({});
Page.storyName = 'Not Found';
Page.args = {};
