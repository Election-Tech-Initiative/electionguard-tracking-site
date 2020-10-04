import React from 'react';
import { Dialog, DialogType, IDialogContentProps } from 'office-ui-fabric-react/lib/Dialog';
import { useTheme } from '@fluentui/react-theme-provider';
import StatusMessage from './StatusMessage';

// Text for Internationalization
const confirmedTrackerTitle = 'Ballot Confirmed';
const confirmedTrackerMessage =
    'The following ballot was securely submitted and counted as part of the election tally.';
const unknownTrackerTitle = 'Ballot Not Found';
const unknownTrackerMessage = `
    There was no record found of the following ballot and it is not part of the official tally. 
    Please double check the spelling of the tracker and search again.
`;

// Icons
const confirmedIcon = 'Completed';
const unknownIcon = 'Unknown';

interface TrackerCodeProps {
    tracker: string;
    confirmed: boolean;
}

const TrackerCode: React.FunctionComponent<TrackerCodeProps> = ({ tracker, confirmed }) => {
    const theme = useTheme();
    return (
        <div
            style={{
                display: 'flex',
                borderColor: confirmed ? theme.palette.green : theme.palette.themePrimary,
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
const confirmedDialogContentProps: IDialogContentProps = {
    type: DialogType.largeHeader,
    title: <StatusMessage icon={confirmedIcon} colorName="green" message={confirmedTrackerTitle} />,
    subText: confirmedTrackerMessage,
    styles: ({ theme }) => ({
        content: { borderColor: theme.palette.green },
    }),
};

const unknownDialogContentProps: IDialogContentProps = {
    type: DialogType.largeHeader,
    title: <StatusMessage icon={unknownIcon} colorName="themePrimary" message={unknownTrackerTitle} />,
    subText: unknownTrackerMessage,
    styles: ({ theme }) => ({
        content: { borderColor: theme.palette.themePrimary },
    }),
};

/**
 * Props for the Tracker Dialog
 */
export interface TrackerDialogProps {
    /** Hidden state of dialog */
    hidden: boolean;
    /** Action to take on dismiss of tracker dialog */
    onDismiss: () => void;
    /** Tracker code */
    tracker: string;
    /** Confirmation status of tracker */
    confirmed: boolean;
}

/**
 * Dialog to display the confirmation status of the tracker
 */
const TrackerDialog: React.FunctionComponent<TrackerDialogProps> = ({ hidden, onDismiss, tracker, confirmed }) => {
    const modalProps = React.useMemo(
        () => ({
            isBlocking: false,
            styles: dialogStyles,
        }),
        []
    );

    return (
        <Dialog
            hidden={hidden}
            onDismiss={onDismiss}
            dialogContentProps={confirmed ? confirmedDialogContentProps : unknownDialogContentProps}
            modalProps={modalProps}
        >
            <TrackerCode tracker={tracker} confirmed={confirmed} />
        </Dialog>
    );
};

export default TrackerDialog;
