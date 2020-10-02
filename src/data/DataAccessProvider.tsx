import React, { createContext, useContext } from 'react';
import { DataAccess } from './DataAccess';

export const DataAccessContext = createContext<DataAccess | null>(null);

export interface DataAccessProviderProps {
    dataAccess: DataAccess;
}

/**
 * Provides access to the DataAccess implementation to child components via context.
 * Place this at the root of the application, or at the root of the UI tree which needs
 * access to data.
 */
export const DataAccessProvider: React.FunctionComponent<DataAccessProviderProps> = ({ dataAccess, children }) => {
    return <DataAccessContext.Provider value={dataAccess}>{children}</DataAccessContext.Provider>;
};

/**
 * Convenience hook for safely retrieving the DataAccess implementation
 * for use in a component.
 */
export function useDataAccess() {
    const dataAccess = useContext(DataAccessContext);

    if (!dataAccess) {
        throw Error('Make sure to wrap the application in a <DataAccessProvider>!');
    }

    return dataAccess;
}
