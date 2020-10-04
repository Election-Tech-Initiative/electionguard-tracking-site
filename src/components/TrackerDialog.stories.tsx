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

const Template: Story<TrackerDialogProps> = ({ tracker, confirmed, isLoading }) => {
    initializeIcons();
    const [hidden, { toggle: toggleHideDialog }] = useBoolean(true);

    return (
        <>
            <DefaultButton secondaryText="Opens the Sample Dialog" onClick={toggleHideDialog} text="Open Dialog" />

            <TrackerDialog
                hidden={hidden}
                isLoading={isLoading}
                tracker={tracker}
                onDismiss={toggleHideDialog}
                confirmed={confirmed}
            />
        </>
    );
};

export const SuccessTrackerDialog = Template.bind({});
SuccessTrackerDialog.storyName = 'Confirmed Tracker Dialog';
SuccessTrackerDialog.args = {
    isLoading: false,
    tracker: 'confirmed-confirmed-confirmed-confirmed-confirmed',
    confirmed: true,
};

export const UnknownTrackerDialog = Template.bind({});
UnknownTrackerDialog.storyName = 'Unknown Tracker Dialog';
UnknownTrackerDialog.args = {
    isLoading: false,
    tracker: 'unknown-unknown-unknown-unknown-unknown-unknown',
    confirmed: false,
};

export const LongTrackerDialog = Template.bind({});
LongTrackerDialog.storyName = 'Long Tracker Dialog';
LongTrackerDialog.args = {
    isLoading: false,
    tracker:
        'long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long',
    confirmed: true,
};

export const LoadingTrackerDialog = Template.bind({});
LoadingTrackerDialog.storyName = 'Loading Dialog';
LoadingTrackerDialog.args = {
    isLoading: true,
    tracker: '',
    confirmed: false,
};
