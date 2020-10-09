import React from 'react';
import { Text } from '@fluentui/react';
import moment from 'moment';
import { useTheme } from '@fluentui/react-theme-provider';

// TODO #?? Resolve internalization of dates using i18n
const dateFormat = 'MM/DD/YYYY h:mm a';

export interface ElectionPlaceholderMessageProps {
    endDate: string;
}

const ElectionPlaceholderMessage: React.FunctionComponent<ElectionPlaceholderMessageProps> = ({ endDate }) => {
    const theme = useTheme();
    return (
        <Text variant="large" styles={{ root: { color: theme.palette.neutralSecondary } }}>
            The election is not finished at this time. Please come back to check for results after
            {' ' + moment(endDate).format(dateFormat)}.
        </Text>
    );
};

export default ElectionPlaceholderMessage;
