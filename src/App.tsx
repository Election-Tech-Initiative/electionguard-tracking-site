import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import 'normalize.css';

import Layout from './components/Layout';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';
import ElectionPage from './pages/ElectionPage';

function App() {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact component={ElectionPage} />
                <Route component={NotFoundPage} />
            </Switch>
        </Layout>
    );
}

export default App;
