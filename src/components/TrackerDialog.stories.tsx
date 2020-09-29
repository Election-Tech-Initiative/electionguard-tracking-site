import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { useBoolean } from '@uifabric/react-hooks';
import { TrackerDialog, TrackerDialogProps } from './TrackerDialog';

export default {
    title: 'TrackerDialog',
    component: TrackerDialog,
} as Meta;

const Template: Story<TrackerDialogProps> = (props) => {
    const [hidden, { toggle: toggleHideDialog }] = useBoolean(true);

    return (
        <>
            <DefaultButton secondaryText="Opens the Sample Dialog" onClick={toggleHideDialog} text="Open Dialog" />

            <TrackerDialog
                hidden={hidden}
                tracker={props.tracker}
                onDismiss={toggleHideDialog}
                confirmed={props.confirmed}
            />
        </>
    );
};

export const SuccessTrackerDialog = Template.bind({});
SuccessTrackerDialog.storyName = 'Confirmed Tracker Dialog';
SuccessTrackerDialog.args = {
    tracker: 'confirmed-confirmed-confirmed-confirmed-confirmed',
    confirmed: true,
};

export const UnknownTrackerDialog = Template.bind({});
UnknownTrackerDialog.storyName = 'Unknown Tracker Dialog';
UnknownTrackerDialog.args = {
    tracker: 'unknown-unknown-unknown-unknown-unknown-unknown',
    confirmed: false,
};

export const LongTrackerDialog = Template.bind({});
LongTrackerDialog.storyName = 'Long Tracker Dialog';
LongTrackerDialog.args = {
    tracker:
        'long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long-long',
    confirmed: true,
};
