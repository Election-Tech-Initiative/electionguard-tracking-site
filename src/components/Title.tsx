import React from 'react';
import { Text } from '@fluentui/react';
import styled from 'styled-components';
import { useTheme } from '@fluentui/react-theme-provider';

const Header = styled.header`
    padding: 52px 0px;
`;

export interface TitleProps {
    title: string;
}

const Title: React.FunctionComponent<TitleProps> = ({ title, children }) => {
    const theme = useTheme();
    return (
        <Header>
            <Text variant="xxLargePlus" as="h1" styles={{ root: { color: theme.palette.neutralPrimary } }}>
                {title}
                {children || null}
            </Text>
        </Header>
    );
};

export default Title;
