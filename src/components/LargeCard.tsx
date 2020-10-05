import React from 'react';
import { useTheme } from '@fluentui/react-theme-provider';
import { Card, CardSection } from '@uifabric/react-cards';

export interface LargeCardProps {
    alignToStart?: boolean;
}

const LargeCard: React.FunctionComponent<LargeCardProps> = ({ alignToStart, children }) => {
    const theme = useTheme();
    return (
        <Card
            styles={{
                root: {
                    padding: theme.spacing.l1,
                    backgroundColor: theme.palette.white,
                    marginBottom: theme.spacing.l1,
                    alignItems: alignToStart ? 'flex-start' : 'stretch',
                    height: 'auto',
                    maxWidth: 'auto',
                },
            }}
        >
            <CardSection>{children || null}</CardSection>
        </Card>
    );
};

export default LargeCard;
