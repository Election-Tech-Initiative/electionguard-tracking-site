import React from 'react';
import { Stack } from '@fluentui/react';
import AppBar from './AppBar';
import { useTheme } from '@fluentui/react-theme-provider';
import { Dropdown, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

// TODO Remove mock data
const appName = 'ElectionGuard Ballot Tracker';
const logoImageUrl = 'https://themingdesigner.blob.core.windows.net/$web/MicrosoftLogo.png';
const placeholder = 'Select Election';
const options: IDropdownOption[] = [
    { key: '1', text: 'Mock Election 1' },
    { key: '2', text: 'Mock Election 2' },
    { key: '3', text: 'Mock Election 3' },
    { key: '4', text: 'Mock Election 4' },
    { key: '5', text: 'Mock Election 5' },
];

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
};

export interface LayoutProps {}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
    const theme = useTheme();
    return (
        <Stack verticalFill>
            <AppBar appName={appName} logoImageUrl={logoImageUrl}>
                <Dropdown placeholder={placeholder} ariaLabel={placeholder} options={options} styles={dropdownStyles} />
            </AppBar>
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
