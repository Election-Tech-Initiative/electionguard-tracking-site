import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { useBoolean } from '@uifabric/react-hooks';
import TrackerDialog, { TrackerDialogProps } from './TrackerDialog';
import { initializeIcons } from '@fluentui/react';

export default {
    title: 'Components/TrackerDialog',
    component: TrackerDialog,
} as Meta;

const Template: Story<TrackerDialogProps> = ({ tracker, trackerState }) => {
    initializeIcons();
    const [hidden, { toggle: toggleHideDialog }] = useBoolean(true);

    return (
        <>
            <DefaultButton secondaryText="Opens the Sample Dialog" onClick={toggleHideDialog} text="Open Dialog" />

            <TrackerDialog hidden={hidden} tracker={tracker} onDismiss={toggleHideDialog} trackerState={trackerState} />
        </>
    );
};

export const SuccessTrackerDialog = Template.bind({});
SuccessTrackerDialog.storyName = 'Confirmed Tracker Dialog';
SuccessTrackerDialog.args = {
    tracker: 'confirmed-confirmed-confirmed-confirmed-confirmed',
    trackerState: 'confirmed',
};

export const SpoiledTrackerDialog = Template.bind({});
SpoiledTrackerDialog.storyName = 'Spoiled Tracker Dialog';
SpoiledTrackerDialog.args = {
    tracker: 'spoiled-spoiled-spoiled-spoiled-spoiled',
    trackerState: 'spoiled',
};

export const UnknownTrackerDialog = Template.bind({});
UnknownTrackerDialog.storyName = 'Unknown Tracker Dialog';
UnknownTrackerDialog.args = {
    tracker: 'unknown-unknown-unknown-unknown-unknown-unknown',
    trackerState: 'unknown',
};

export const LongTrackerDialog = Template.bind({});
LongTrackerDialog.storyName = 'Long Tracker Dialog';
LongTrackerDialog.args = {
    tracker:
        'long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long',
    trackerState: 'confirmed',
};

export const LoadingTrackerDialog = Template.bind({});
LoadingTrackerDialog.storyName = 'Loading Dialog';
LoadingTrackerDialog.args = {
    tracker: '',
    trackerState: 'loading',
};
