import React from 'react';
import { Text } from '@fluentui/react';
import moment from 'moment';
import Title from './Title';
import { useTheme } from '@fluentui/react-theme-provider';

// TODO #?? Resolve internalization of language using i18n
const defaultElectionName = 'Election';
// TODO #?? Resolve internalization of dates using i18n
const dateFormat = 'MM/DD/YYYY';

export interface ElectionTitleProps {
    electionName?: string;
    startDate: string;
    endDate: string;
}

const ElectionTitle: React.FunctionComponent<ElectionTitleProps> = ({ electionName, startDate, endDate }) => {
    const theme = useTheme();
    return (
        <Title title={electionName ?? defaultElectionName}>
            <Text as="span" styles={{ root: { color: theme.palette.neutralSecondary } }}>{`${moment(startDate).format(
                dateFormat
            )}-${moment(endDate).format(dateFormat)}`}</Text>
        </Title>
    );
};

export default ElectionTitle;
