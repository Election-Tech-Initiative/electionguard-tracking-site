import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { initializeIcons, Text } from '@fluentui/react';
import Layout from './Layout';
import LargeCard from './LargeCard';

export default {
    title: 'Components/Layout',
    component: Layout,
    parameters: { layout: 'fullscreen' },
} as Meta;

const Template: Story = () => {
    initializeIcons();
    return (
        <Layout>
            <LargeCard>
                <Text variant="large" as="h2">
                    Content
                </Text>
            </LargeCard>
        </Layout>
    );
};

export const Standard = Template.bind({});
