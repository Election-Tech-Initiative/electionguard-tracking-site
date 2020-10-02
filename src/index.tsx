import React from 'react';
import ReactDOM from 'react-dom';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { initializeIcons } from '@uifabric/icons';

import App from './App';
import * as serviceWorker from './serviceWorker';
import { DataAccessProvider } from './data/DataAccessProvider';
import { PublishedDataAccess } from './data/PublishedDataAccess';
import { LocalizationProvider } from './localization/LocalizationProvider';

initializeIcons();

const queryCache = new QueryCache();
const dataAccess = new PublishedDataAccess();

ReactDOM.render(
    <React.StrictMode>
        <ReactQueryCacheProvider queryCache={queryCache}>
            <LocalizationProvider>
                <DataAccessProvider dataAccess={dataAccess}>
                    <Router>
                        <App />
                    </Router>
                </DataAccessProvider>
            </LocalizationProvider>
        </ReactQueryCacheProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
