import React from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { LocalizationProvider } from '../src/localization/LocalizationProvider';
import { DataAccessProvider } from '../src/data/DataAccessProvider';
import { MockDataAccess } from '../src/mocks/MockDataAccess';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    layout: 'centered',
};

const queryCache = new QueryCache();
const dataAccess = new MockDataAccess();

export const decorators = [
    (Story) => (
        <ReactQueryCacheProvider queryCache={queryCache}>
            <DataAccessProvider dataAccess={dataAccess}>
                <LocalizationProvider>
                    <Story />
                </LocalizationProvider>
            </DataAccessProvider>
        </ReactQueryCacheProvider>
    ),
];
