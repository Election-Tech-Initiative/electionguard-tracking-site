import { ReactQueryConfig } from 'react-query';
import { DataAccess } from './data/DataAccess';
import { PublishedDataAccess } from './data/PublishedDataAccess';

export interface Config {
    cache: ReactQueryConfig;
    getDataAccess: () => DataAccess;
}

const config: Config = {
    // Configure global data cache settings here.  These can be
    // overridden per query.
    //
    // Some examples are below, but check out the official
    // react-query docs for the full list.
    cache: {
        queries: {
            // Prevent automatic refetch for this duration after fetching
            staleTime: 30 * 1000,

            /*
            Comment out to disable an automatic check of new data when a component
            mounts which needs it...
            */
            // refetchOnMount: false,

            /*
            Comment out to implement a global success callback
            */
            // onSuccess: (data) => { console.log(`Fetched ${data}`) },

            /*
            Comment out to implement a global error callback
            */
            // onError: (error) => { console.error(`Fetched failed: ${error}`) },
        },
    },

    // Configure the data access mechanism, defaulting to static published files.
    getDataAccess: () => new PublishedDataAccess(),
};

export default config;
