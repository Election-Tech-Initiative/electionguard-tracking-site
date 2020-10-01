import React from 'react';
import { useTheme } from '@fluentui/react-theme-provider';
import { Card } from '@uifabric/react-cards';

export interface LargeCardProps {}

const LargeCard: React.FunctionComponent<LargeCardProps> = ({ children }) => {
    const theme = useTheme();
    return (
        <Card
            styles={{
                root: {
                    padding: theme.spacing.l1,
                    backgroundColor: theme.palette.white,
                    marginBottom: theme.spacing.l1,
                    maxWidth: 'auto',
                },
            }}
        >
            {children || null}
        </Card>
    );
};

export default LargeCard;
