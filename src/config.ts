import { ReactQueryConfig } from 'react-query';
import { DataAccess } from './data/DataAccess';
import { PublishedDataAccess } from './data/PublishedDataAccess';

export interface Config {
    cache: ReactQueryConfig;
    getDataAccess: () => DataAccess;
}

const config: Config = {
    cache: {},
    getDataAccess: () => new PublishedDataAccess(),
};

export default config;
