import React from 'react';
import { Image, Stack, Text } from '@fluentui/react';
import { Depths } from '@fluentui/theme';
import { useTheme } from '@fluentui/react-theme-provider';

export interface AppBarProps {
    logoImageUrl?: string;
    appName: string;
}

const AppBar: React.FunctionComponent<AppBarProps> = ({ logoImageUrl, appName, children }) => {
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
                {logoImageUrl ? (
                    <>
                        <Image styles={{ image: { width: '120px', display: 'block' } }} alt="logo" src={logoImageUrl} />
                        <Text as="span" styles={{ root: { fontWeight: 600 } }}>
                            {`| ${appName}`}
                        </Text>
                    </>
                ) : (
                    <Text as="span" styles={{ root: { fontWeight: 600 } }}>
                        {appName}
                    </Text>
                )}
            </Stack>
            <Stack horizontal verticalAlign="center">
                {children || null}
            </Stack>
        </Stack>
    );
};

export default AppBar;
