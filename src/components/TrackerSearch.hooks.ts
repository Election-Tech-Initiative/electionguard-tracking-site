import { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import { useSearchBallots } from '../data/queries';

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
    const trimmedQuery = query?.replace(/-|\s+/g, '');
    const shouldQuery = !!trimmedQuery && trimmedQuery.length >= minimumQueryLength;
    const { data: searchResults, isLoading } = useSearchBallots(electionId, trimmedQuery, shouldQuery);

    const runQuery = useCallback(
        debounce((q) => setQuery(q), debounceTimeInMs),
        [debounceTimeInMs]
    );

    return { searchResults, isLoading, runQuery };
}
