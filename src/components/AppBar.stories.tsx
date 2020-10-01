import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import AppBar, { AppBarProps } from './AppBar';
import { PrimaryButton, Stack } from '@fluentui/react';
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
            <AppBar {...props}>
                <PrimaryButton text="Change Election" />
            </AppBar>
        </Stack>
    );
};

export const StandardAppBar = Template.bind({});
StandardAppBar.storyName = 'App Bar';
StandardAppBar.args = {
    logoImageUrl: 'https://themingdesigner.blob.core.windows.net/$web/MicrosoftLogo.png',
    appName: 'ElectionGuard Ballot Tracker',
};

export const NoLogoAppBar = Template.bind({});
NoLogoAppBar.storyName = 'No Logo App Bar';
NoLogoAppBar.args = {
    appName: 'ElectionGuard Ballot Tracker',
};
