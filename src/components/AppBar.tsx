import React from 'react';
import { Image, Stack, Text } from '@fluentui/react';
import { Depths } from '@fluentui/theme';
import { useTheme } from '@fluentui/react-theme-provider';
import { useMediaQuery } from 'react-responsive';

export interface MobileAppBarProps {
    logoImageUrl: string;
    logoUrl?: string;
}

const MobileAppBar: React.FunctionComponent<MobileAppBarProps> = ({ logoImageUrl, logoUrl }) => {
    const theme = useTheme();
    return (
        <Stack
            horizontal
            verticalAlign="center"
            horizontalAlign="center"
            styles={{
                root: {
                    marginBottom: 2,
                    padding: '0px 32px',
                    minHeight: 47,
                    boxShadow: Depths.depth8,
                    backgroundColor: theme.palette.white,
                },
            }}
        >
            <a href={logoUrl ?? ''}>
                <Image styles={{ image: { width: '120px', display: 'block' } }} alt="logo" src={logoImageUrl} />
            </a>
        </Stack>
    );
};

const DesktopAppBar: React.FunctionComponent<AppBarProps> = ({ logoImageUrl, logoUrl, appName, children }) => {
    const theme = useTheme();
    return (
        <Stack
            horizontal
            verticalAlign="center"
            horizontalAlign="space-between"
            styles={{
                root: {
                    marginBottom: 2,
                    padding: '0px 32px',
                    minHeight: 47,
                    boxShadow: Depths.depth8,
                    backgroundColor: theme.palette.white,
                },
            }}
        >
            <Stack horizontal verticalAlign="center">
                <a href={logoUrl ?? ''}>
                    <Image styles={{ image: { width: '120px', display: 'block' } }} alt="logo" src={logoImageUrl} />
                </a>
                <Text as="span" styles={{ root: { fontWeight: 600 } }}>
                    {`| ${appName}`}
                </Text>
            </Stack>
            <Stack horizontal verticalAlign="center">
                {children || null}
            </Stack>
        </Stack>
    );
};

export interface AppBarProps {
    logoImageUrl: string;
    logoUrl?: string;
    appName: string;
}

const AppBar: React.FunctionComponent<AppBarProps> = ({ logoImageUrl, logoUrl, appName, children }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 480px)' });

    return isMobile ? (
        <MobileAppBar logoImageUrl={logoImageUrl} logoUrl={logoUrl} />
    ) : (
        <DesktopAppBar logoImageUrl={logoImageUrl} logoUrl={logoUrl} appName={appName}>
            {children || null}
        </DesktopAppBar>
    );
};

export default AppBar;
