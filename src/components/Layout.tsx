import React from 'react';
import { Stack } from '@fluentui/react';
import AppBar from './AppBar';
import { useTheme } from '@fluentui/react-theme-provider';

// TODO Remove mock data
const appName = 'ElectionGuard Ballot Tracker';
const logoImageUrl = 'https://themingdesigner.blob.core.windows.net/$web/MicrosoftLogo.png';

export interface LayoutProps {}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
    const theme = useTheme();
    return (
        <Stack verticalFill>
            <AppBar appName={appName} logoImageUrl={logoImageUrl} />
            <Stack
                verticalFill
                styles={{
                    root: {
                        backgroundColor: theme.palette.neutralLighterAlt,
                        padding: '0 40px',
                        overflowY: 'auto',
                    },
                }}
            >
                {children || null}
            </Stack>
        </Stack>
    );
};

export default Layout;
