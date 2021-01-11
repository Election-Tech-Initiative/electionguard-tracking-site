import React from 'react';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { useTheme } from '@fluentui/react-theme-provider';
import StatusMessage from './StatusMessage';
import { IPalette, Spinner, SpinnerSize } from '@fluentui/react';

export type TrackerDialogStateOption = 'loading' | 'spoiled' | 'confirmed' | 'unknown';

interface TrackerDialogStateSettings {
    icon: string;
    color: keyof IPalette;
    title: string;
    message: string;
}

const states: { [state in TrackerDialogStateOption]: TrackerDialogStateSettings } = {
    loading: {
        icon: 'Search',
        color: 'neutralPrimary',
        title: 'Searching',
        message: '',
    },
    confirmed: {
        icon: 'Completed',
        color: 'green',
        title: 'Ballot Confirmed',
        message: 'The following ballot was securely submitted and counted as part of the election tally.',
    },
    spoiled: {
        icon: 'Error',
        color: 'redDark',
        title: 'Ballot Spoiled',
        message: 'The following ballot was not included in the election tally.',
    },
    unknown: {
        icon: 'Unknown',
        color: 'themePrimary',
        title: 'Ballot Not Found',
        message: `There was no record found of the following ballot and it is not part of the official tally. 
Please double check the spelling of the tracker and search again.`,
    },
};

/**
 * Props for the Tracker Dialog
 */
export interface TrackerDialogProps {
    /** Hidden state of dialog */
    hidden: boolean;
    /** Action to take on dismiss of tracker dialog */
    onDismiss: () => void;
    /** Action to take once the dialog has disappeared */
    onDismissed?: () => void;
    /** Tracker code */
    tracker: string;
    /** The visual state of the dialog */
    trackerState: TrackerDialogStateOption;
}

/**
 * Dialog to display the confirmation status of the tracker
 */
const TrackerDialog: React.FunctionComponent<TrackerDialogProps> = ({
    hidden,
    onDismiss,
    onDismissed,
    tracker,
    trackerState,
}) => {
    const modalProps = React.useMemo(
        () => ({
            isBlocking: false,
            styles: dialogStyles,
            onDismissed,
        }),
        [onDismissed]
    );

    const { color, icon, message, title } = states[trackerState];
    const isLoading = trackerState === 'loading';

    return (
        <Dialog
            hidden={hidden}
            onDismiss={onDismiss}
            dialogContentProps={{
                type: DialogType.largeHeader,
                title: <StatusMessage icon={icon} colorName={color} message={title} />,
                subText: message,
                styles: ({ theme }) => ({
                    content: { borderColor: theme.palette[color] },
                }),
            }}
            modalProps={modalProps}
        >
            {isLoading ? <Spinner size={SpinnerSize.large} /> : <TrackerCode tracker={tracker} color={color} />}
        </Dialog>
    );
};

interface TrackerCodeProps {
    tracker: string;
    color: keyof IPalette;
}

const TrackerCode: React.FunctionComponent<TrackerCodeProps> = ({ tracker, color }) => {
    const theme = useTheme();
    return (
        <div
            style={{
                display: 'flex',
                borderColor: theme.palette[color],
                borderStyle: 'solid',
                borderWidth: 2,
                padding: 8,
            }}
        >
            {tracker}
        </div>
    );
};

const dialogStyles = { main: { maxWidth: 450 } };

export default TrackerDialog;
