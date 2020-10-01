import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'normalize.css';

import Layout from './components/Layout';
import InputTrackerPage from './pages/InputTrackerPage';
import ResultsPage from './pages/ResultsPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

function App() {
    return (
        <Router>
            <Layout>
                <Switch>
                    <Route path="/" exact component={InputTrackerPage} />
                    <Route path="/results" component={ResultsPage} />
                    <Route component={NotFoundPage} />
                </Switch>
            </Layout>
        </Router>
    );
}

export default App;
