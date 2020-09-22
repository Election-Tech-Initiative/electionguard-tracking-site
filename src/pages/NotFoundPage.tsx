import React from 'react';
import { StackItem } from '@fluentui/react';
import Title from '../components/Title';

export interface NotFoundPageProps {}

const NotFoundPage: React.FunctionComponent<NotFoundPageProps> = () => {
    return (
        <StackItem align="center">
            <Title>404</Title>
        </StackItem>
    );
};

export default NotFoundPage;
