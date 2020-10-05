import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { initializeIcons, Text } from '@fluentui/react';
import LargeCard from './LargeCard';

export default {
    title: 'Components/LargeCard',
    component: LargeCard,
} as Meta;

const Template: Story = () => {
    initializeIcons();
    return (
        <LargeCard>
            <Text variant="large" as="h2">
                Content
            </Text>
        </LargeCard>
    );
};

export const Standard = Template.bind({});
