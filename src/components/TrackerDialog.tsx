import React from 'react';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { Dialog, DialogType, IDialogContentProps } from 'office-ui-fabric-react/lib/Dialog';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { useTheme } from '@fluentui/react-theme-provider';
import styled from 'styled-components';

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

const titleIcon = mergeStyles({
    fontSize: 36,
    height: 36,
    width: 36,
    marginRight: 10,
});

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

const DialogTitle = styled.div`
    display: flex;
    align-items: center;
`;

const dialogStyles = { main: { maxWidth: 450 } };
const confirmedDialogContentProps: IDialogContentProps = {
    type: DialogType.largeHeader,
    title: (
        <DialogTitle>
            <FontIcon iconName={confirmedIcon} className={titleIcon} />
            {confirmedTrackerTitle}
        </DialogTitle>
    ),
    subText: confirmedTrackerMessage,
    styles: ({ theme }) => ({
        title: { color: theme.palette.green },
        content: { borderColor: theme.palette.green },
    }),
};

const unknownDialogContentProps: IDialogContentProps = {
    type: DialogType.largeHeader,
    title: (
        <DialogTitle>
            <FontIcon iconName={unknownIcon} className={titleIcon} />
            {unknownTrackerTitle}
        </DialogTitle>
    ),
    subText: unknownTrackerMessage,
    styles: ({ theme }) => ({
        title: { color: theme.palette.themePrimary },
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
