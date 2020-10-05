import React from 'react';
import { Text } from '@fluentui/react';
import styled from 'styled-components';
import { useTheme } from '@fluentui/react-theme-provider';
import { useMediaQuery } from 'react-responsive';

const MobileHeader = styled.header`
    padding: 16px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const Header = styled.header`
    padding: 52px 0px;
`;

export interface TitleProps {
    title: string;
}

const Title: React.FunctionComponent<TitleProps> = ({ title, children }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery({ query: '(max-width: 480px)' });
    return isMobile ? (
        <MobileHeader>
            <Text variant="xLargePlus" as="h1" styles={{ root: { color: theme.palette.neutralPrimary } }}>
                {title}
            </Text>
            {children || null}
        </MobileHeader>
    ) : (
        <Header>
            <Text variant="xxLargePlus" as="h1" styles={{ root: { color: theme.palette.neutralPrimary } }}>
                {title}
                <div
                    style={{
                        display: 'inline-block',
                        marginLeft: theme.spacing.l1,
                    }}
                >
                    {children || null}
                </div>
            </Text>
        </Header>
    );
};

export default Title;
