import React from 'react';
import { Stack } from '@fluentui/react';

import AsyncContent from '../components/AsyncContent';
import { QueryResult } from '../data/queries';
import { Redirect } from 'react-router-dom';
import { ElectionDescription } from '../models/election';

export interface HomePageProps {
    electionsQuery: QueryResult<ElectionDescription[]>;
}

const ElectionPage: React.FunctionComponent<HomePageProps> = ({ electionsQuery }) => {
    return (
        <Stack>
            <AsyncContent query={electionsQuery} errorMessage="Unable to load any elections at this time.">
                {(elections) => {
                    const election = elections[0];
                    return <Redirect to={`/${election.election_scope_id}`} />;
                }}
            </AsyncContent>
        </Stack>
    );
};

export default ElectionPage;
