import React from 'react';
import { Text } from '@fluentui/react';

export interface TitleProps {}

const Title: React.FunctionComponent<TitleProps> = ({ children }) => {
    return (
        <Text variant="mega" as="h1">
            {children}
        </Text>
    );
};

export default Title;
