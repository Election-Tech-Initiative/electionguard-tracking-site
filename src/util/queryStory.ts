import { QueryResult } from '../data/queries';

/**
 * @module
 * Provides helper functionality for simulating async queries in Storybook
 */

/**
 * A valid state for an async query to be in
 */
export type QueryState = 'loading' | 'success' | 'error';

export interface QueryStoryArgs {
    queryState: QueryState;
}

/**
 * Spread these into the `argTypes` of your story Meta export
 * in order to cleanly support a control for the query state.
 */
export const queryArgTypes = {
    queryState: {
        name: 'Query State',
        control: { type: 'radio', options: ['loading', 'success', 'error'] },
    },
};

/**
 * Construct an appropriate QueryResult from a query state
 */
export function getDummyQueryResult<T>(queryState: QueryState, data: T): QueryResult<T> {
    let queryResult: QueryResult<T> = {
        data: undefined,
        isLoading: false,
        isError: false,
    };
    switch (queryState) {
        case 'success': {
            queryResult.data = data;
            break;
        }
        case 'loading': {
            queryResult.isLoading = true;
            break;
        }
        case 'error': {
            queryResult.isError = true;
            break;
        }
    }

    return queryResult;
}
