import React from 'react';
import { Switch, Route } from 'react-router-dom';
import 'normalize.css';

import Layout from './components/Layout';
import NotFoundPage from './pages/NotFoundPage';
import ElectionPage from './pages/ElectionPage';
import HomePage from './pages/HomePage';

import './App.css';

function App() {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path="/:electionId" component={ElectionPage} />
                <Route component={NotFoundPage} />
            </Switch>
        </Layout>
    );
}

export default App;
