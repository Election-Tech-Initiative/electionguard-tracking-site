import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';

import Layout from './Layout';
import { StackItem } from '@fluentui/react';

export default {
    title: 'Layout',
    component: Layout,
    parameters: { layout: 'fullscreen' },
} as Meta;

const Template: Story = () => (
    <Layout>
        <StackItem styles={{ root: { height: 20, background: '#bada55' } }}>Header</StackItem>
        <StackItem grow styles={{ root: { background: 'magenta' } }}>
            Content
        </StackItem>
    </Layout>
);

export const Standard = Template.bind({});
