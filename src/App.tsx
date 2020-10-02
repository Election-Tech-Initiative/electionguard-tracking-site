import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import 'normalize.css';

import Layout from './components/Layout';
import InputTrackerPage from './pages/InputTrackerPage';
import ResultsPage from './pages/ResultsPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

function App() {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact>
                    <Redirect to="/confirm-ballot" />
                </Route>
                <Route path="/confirm-ballot" component={InputTrackerPage} />
                <Route path="/results" component={ResultsPage} />
                <Route component={NotFoundPage} />
            </Switch>
        </Layout>
    );
}

export default App;
