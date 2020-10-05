import React from 'react';
import { Switch, Route } from 'react-router-dom';
import 'normalize.css';

import Layout from './components/Layout';
import NotFoundPage from './pages/NotFoundPage';
import ElectionPage from './pages/ElectionPage';
import HomePage from './pages/HomePage';

import './App.css';
import { useElections } from './data/queries';

function App() {
    const electionsQuery = useElections();

    return (
        <Layout>
            <Switch>
                <Route path="/" exact render={() => <HomePage electionsQuery={electionsQuery} />} />
                <Route path="/:electionId" render={() => <ElectionPage electionsQuery={electionsQuery} />} />
                <Route component={NotFoundPage} />
            </Switch>
        </Layout>
    );
}

export default App;
