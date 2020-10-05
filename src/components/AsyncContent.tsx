import React from 'react';
import { Spinner, SpinnerSize, StackItem } from '@fluentui/react';

import { QueryResult } from '../data/queries';
import StatusMessage from './StatusMessage';

export interface AsyncContentProps<T> {
    children: (data: T) => React.ReactElement;
    errorMessage?: string;
    query: QueryResult<T>;
}

function AsyncContent<T>({ children, errorMessage = 'Something went wrong!', query }: AsyncContentProps<T>) {
    const { data, isLoading, isError } = query;

    if (isLoading) {
        return (
            <StackItem align="center" tokens={{ padding: 20 }}>
                <Spinner size={SpinnerSize.large} />
            </StackItem>
        );
    } else if (isError || data === undefined) {
        return (
            <StackItem tokens={{ padding: 20 }}>
                <StatusMessage message={errorMessage} icon="StatusErrorFull" colorName="redDark" />
            </StackItem>
        );
    } else {
        return <>{children(data)}</>;
    }
}

export default AsyncContent;
