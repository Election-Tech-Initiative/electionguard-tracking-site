import React from 'react';
import { useTheme } from '@fluentui/react-theme-provider';

export interface LargeCardProps {
    alignToStart?: boolean;
}

const LargeCard: React.FunctionComponent<LargeCardProps> = ({ alignToStart, children }) => {
    const theme = useTheme();
    return (
        <div
            style={{
                padding: theme.spacing.l1,
                backgroundColor: theme.palette.white,
                marginBottom: theme.spacing.l1,
                alignItems: alignToStart ? 'flex-start' : 'stretch',
                height: 'auto',
                maxWidth: 'auto',
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
                borderBottomRightRadius: 2,
                borderBottomLeftRadius: 2,
                boxShadow: 'rgba(0, 0, 0, 0.133) 0px 1.6px 3.6px 0px, rgba(0, 0, 0, 0.11) 0px 0.3px 0.9px 0px',
            }}
        >
            {children || null}
        </div>
    );
};

export default LargeCard;
