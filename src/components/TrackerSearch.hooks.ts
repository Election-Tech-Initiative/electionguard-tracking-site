import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { useSearchBallots } from '../data/queries';
import { TrackedBallot } from '../models/tracking';

const DEFAULT_MINIMUM_QUERY_LENGTH = 3;
const DEFAULT_DEBOUNCE_TIME_MS = 300;

export interface SearchOptions {
    minimumQueryLength?: number;
    debounceTimeInMs?: number;
}

/**
 * Perform a lightly-optimized debounced search for ballots by tracker code
 */
export function useSearch(electionId: string, options: SearchOptions = {}) {
    const { minimumQueryLength = DEFAULT_MINIMUM_QUERY_LENGTH, debounceTimeInMs = DEFAULT_DEBOUNCE_TIME_MS } = options;

    const [query, setQuery] = useState<string>('');
    const [previousResults, setPreviousResults] = useState<TrackedBallot[] | undefined>();

    const trimmedQuery = query?.replace(/-|\s+/g, '')?.toLowerCase();
    const shouldQuery = !!trimmedQuery && trimmedQuery.length >= minimumQueryLength;
    const { data: searchResults, isLoading, isIdle } = useSearchBallots(electionId, trimmedQuery, shouldQuery);

    useEffect(() => {
        if (searchResults) {
            setPreviousResults(searchResults);
        }
    }, [searchResults]);

    const runQuery = useCallback(
        debounce((q) => setQuery(q), debounceTimeInMs),
        [debounceTimeInMs]
    );

    const resultsToShow = isLoading ? previousResults : searchResults;

    return { searchResults: resultsToShow, previousResults: previousResults, isLoading: isLoading || isIdle, runQuery };
}
