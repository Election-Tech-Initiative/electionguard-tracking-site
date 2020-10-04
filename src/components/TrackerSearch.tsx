import React, { useEffect, useState } from 'react';
import { Label } from '@fluentui/react';
import Autosuggest, { InputProps } from 'react-autosuggest';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import LargeCard from './LargeCard';
import { TrackedBallot } from '../models/tracking';
import TrackerDialog from './TrackerDialog';
import { useSearch } from './TrackerSearch.hooks';

export interface TrackerSearchProps {
    electionId: string;
}

const TrackerSearch: React.FunctionComponent<TrackerSearchProps> = ({ electionId }) => {
    const history = useHistory();
    const { path, url } = useRouteMatch();

    const [inputValue, setInputValue] = useState<string>('');

    const { searchResults, isLoading, runQuery } = useSearch(electionId);

    const inputProps: InputProps<TrackedBallot> = {
        placeholder: 'Enter your tracker code here',
        value: inputValue,
        onChange: (event, { newValue, method }) => {
            setInputValue(newValue);
        },
    };

    return (
        <>
            <LargeCard alignToStart>
                <Label>Ballot Search</Label>
                <Autosuggest
                    suggestions={searchResults || []}
                    onSuggestionsFetchRequested={({ value }) => {
                        runQuery(value);
                    }}
                    onSuggestionsClearRequested={() => {
                        runQuery('');
                    }}
                    onSuggestionSelected={(event, { suggestion }) => {
                        const tracker = suggestion.tracker_words;
                        history.push(`${url}/track/${tracker}`);
                    }}
                    getSuggestionValue={(result) => result.tracker_words}
                    renderSuggestion={(result) => result.tracker_words}
                    inputProps={inputProps}
                />
                <Switch>
                    <Route
                        path={`${path}/track/:tracker`}
                        render={() => (
                            <TrackerResults
                                searchResults={searchResults}
                                updateQuery={(newQuery) => {
                                    setInputValue(newQuery);
                                    runQuery(newQuery);
                                }}
                                isQuerying={isLoading}
                            />
                        )}
                    />
                </Switch>
            </LargeCard>
        </>
    );
};

interface TrackerResultsProps {
    isQuerying: boolean;
    searchResults: TrackedBallot[] | undefined;
    updateQuery: (query: string) => void;
}

const TrackerResults: React.FunctionComponent<TrackerResultsProps> = ({ searchResults, isQuerying, updateQuery }) => {
    const history = useHistory();
    const { params } = useRouteMatch<{ tracker: string }>();
    const tracker = params.tracker;

    const existingBallot = searchResults?.find((r) => r.tracker_words === tracker);

    const isLoading = !existingBallot && isQuerying;

    useEffect(() => {
        if (!existingBallot) {
            updateQuery(tracker);
        }
    }, [tracker, existingBallot, updateQuery]);

    return (
        <TrackerDialog
            hidden={false}
            isLoading={isLoading}
            tracker={tracker}
            confirmed={!!existingBallot}
            onDismiss={() => {
                history.replace('/');
            }}
        />
    );
};

export default TrackerSearch;
