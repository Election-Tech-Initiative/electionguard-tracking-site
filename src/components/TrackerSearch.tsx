import React, { useEffect, useState } from 'react';
import { Label } from '@fluentui/react';
import { Theme, useTheme } from '@fluentui/react-theme-provider';
import Autosuggest, { InputProps } from 'react-autosuggest';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import LargeCard from './LargeCard';
import { TrackedBallot } from '../models/tracking';
import TrackerDialog from './TrackerDialog';
import { useSearch } from './TrackerSearch.hooks';

export interface TrackerSearchProps {
    electionId: string;
}

const fromTheme = (theme: Theme) => {
    const { palette, fonts, spacing, semanticColors, effects } = theme;
    return {
        container: {
            width: '100%',
        },
        input: {
            color: semanticColors.inputText,
            backgroundColor: semanticColors.inputBackground,
            padding: '2px 4px 1px 4px',
            borderRadius: effects.roundedCorner2,
            border: `1px solid ${semanticColors.inputBorder}`,
            height: 32,
            width: '100%',
            outline: 'none',
            fontFamily: fonts.medium.fontFamily,
            fontSize: fonts.medium.fontSize,
            fontColor: fonts.medium.color,
            maxWidth: 400,
        },
        inputOpen: { borderColor: semanticColors.inputBorderHovered },
        inputFocused: {
            borderColor: semanticColors.inputFocusBorderAlt,
            cornerRadius: effects.roundedCorner2,
        },
        suggestionsContainer: {
            padding: 0,
        },
        suggestionsContainerOpen: {
            maxWidth: 650,
            marginTop: 4,
            padding: 0,
            border: `1px solid ${semanticColors.disabledBorder}`,
        },
        suggestionsList: {
            margin: 0,
            padding: 0,
            fontFamily: fonts.medium.fontFamily,
            fontSize: fonts.medium.fontSize,
            fontColor: fonts.medium.color,
            listStyle: 'none',
        },
        suggestion: {
            padding: spacing.m,
            whiteSpace: 'nowrap' as 'nowrap', // # Fixes bug with react-autosuggest theme
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        suggestionHighlighted: {
            backgroundColor: palette.neutralLighterAlt,
        },
    };
};

const TrackerSearch: React.FunctionComponent<TrackerSearchProps> = ({ electionId }) => {
    const history = useHistory();
    const { path, url } = useRouteMatch();

    const theme = useTheme();

    // Track the raw input value from the user
    const [inputValue, setInputValue] = useState<string>('');

    const { results, isLoading, search, clear } = useSearch(electionId);

    // Wire up the input element to the search input value
    const inputProps: InputProps<TrackedBallot> = {
        placeholder: 'Enter your tracker code here',
        value: inputValue,
        onChange: (_event, { newValue }) => {
            setInputValue(newValue);
        },
    };

    return (
        <>
            <LargeCard alignToStart>
                <Label>Ballot Search</Label>
                <Autosuggest
                    theme={fromTheme(theme)}
                    suggestions={results}
                    onSuggestionsFetchRequested={({ value }) => {
                        search(value);
                    }}
                    onSuggestionsClearRequested={() => {
                        setInputValue('');
                        clear();
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
                                searchResults={results}
                                updateQuery={(newQuery) => {
                                    setInputValue(newQuery);
                                    search(newQuery);
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
    searchResults: TrackedBallot[];
    updateQuery: (query: string) => void;
}

const TrackerResults: React.FunctionComponent<TrackerResultsProps> = ({ searchResults, isQuerying, updateQuery }) => {
    const history = useHistory();
    const { params } = useRouteMatch<{ tracker: string }>();
    const tracker = params.tracker;

    const isMatch = (ballot: TrackedBallot) => ballot.tracker_words === tracker;
    const existingBallot = searchResults?.find(isMatch);

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
