import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { initializeIcons } from '@fluentui/react';
import TrackerSearchBox from './TrackerSearchBox';

export default {
    title: 'Components/TrackerSearchBox',
    component: TrackerSearchBox,
} as Meta;

const Template: Story = () => {
    initializeIcons();
    return (
        <div>
            <TrackerSearchBox />
        </div>
    );
};

export const Standard = Template.bind({});
