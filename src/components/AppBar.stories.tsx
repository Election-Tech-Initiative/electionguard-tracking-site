import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import AppBar, { AppBarProps } from './AppBar';
import { Stack } from '@fluentui/react';
import { useTheme } from '@fluentui/react-theme-provider';

export default {
    title: 'Components/AppBar',
    component: AppBar,
    parameters: { layout: 'fullscreen' },
} as Meta;

const Template: Story<AppBarProps> = (props) => {
    const theme = useTheme();
    return (
        <Stack verticalFill styles={{ root: { backgroundColor: theme.palette.neutralLighterAlt } }}>
            <AppBar {...props} />
        </Stack>
    );
};

export const StandardAppBar = Template.bind({});
StandardAppBar.storyName = 'App Bar';
StandardAppBar.args = {
    logoImageUrl: 'https://themingdesigner.blob.core.windows.net/$web/MicrosoftLogo.png',
    appName: 'ElectionGuard Ballot Tracker',
    logoUrl: 'https://www.microsoft.com',
};

export const NoLinkAppBar = Template.bind({});
NoLinkAppBar.storyName = 'No Link App Bar';
NoLinkAppBar.args = {
    logoImageUrl: 'https://themingdesigner.blob.core.windows.net/$web/MicrosoftLogo.png',
    appName: 'ElectionGuard Ballot Tracker',
};
