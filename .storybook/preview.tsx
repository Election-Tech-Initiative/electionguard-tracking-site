import React from 'react';
import { initializeIcons } from '@uifabric/icons';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { MemoryRouter } from 'react-router';

import { LocalizationProvider } from '../src/localization/LocalizationProvider';
import { DataAccessProvider } from '../src/data/DataAccessProvider';
import { MockDataAccess } from '../src/mocks/MockDataAccess';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { hideNoControlsWarning: true },
    layout: 'centered',
};

const queryCache = new QueryCache();
const dataAccess = new MockDataAccess();

initializeIcons();

export const decorators = [
    (Story) => (
        <MemoryRouter initialEntries={['/']}>
            <ReactQueryCacheProvider queryCache={queryCache}>
                <DataAccessProvider dataAccess={dataAccess}>
                    <LocalizationProvider>
                        <Story />
                    </LocalizationProvider>
                </DataAccessProvider>
            </ReactQueryCacheProvider>
        </MemoryRouter>
    ),
];
