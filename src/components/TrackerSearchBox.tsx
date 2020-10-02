import { BasePickerListBelow, IBasePickerProps, IPickerItemProps, ISuggestionItemProps } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { useBoolean } from '@uifabric/react-hooks';
import TrackerDialog from './TrackerDialog';

interface TrackerSearchBoxProps {}

export interface ITrackerProps {
    tracker_code: string;
}

export interface ITrackerPickerProps extends IBasePickerProps<BallotSearchResult> {}

class TrackerPicker extends BasePickerListBelow<BallotSearchResult, ITrackerPickerProps> {}

interface BallotSearchResult {
    id: string;
    election_id: string;
    state: string;
    tracker_words: string;
    tracker_words_for_search: string;
}

const TrackerItem: (trackerProps: BallotSearchResult, itemProps: ISuggestionItemProps<any>) => JSX.Element = (
    trackerProps: BallotSearchResult,
    itemProps: ISuggestionItemProps<any>
) => {
    return <div>{trackerProps.tracker_words}</div>;
};

const data: BallotSearchResult[] = [
    {
        id: '1',
        election_id: 'election',
        state: 'Cast',
        tracker_words: 'fake code fake code 1',
        tracker_words_for_search: 'fakecodefakecode1',
    },
    {
        id: '2',
        election_id: 'election',
        state: 'Cast',
        tracker_words: 'fake code fake code 2',
        tracker_words_for_search: 'fakecodefakecode2',
    },
    {
        id: '3',
        election_id: 'election',
        state: 'Cast',
        tracker_words: 'fake code fake code 3',
        tracker_words_for_search: 'fakecodefakecode3',
    },
];

const onFilterChanged = (filterText: string, items?: BallotSearchResult[]): BallotSearchResult[] => {
    if (!items) {
        return [];
    }
    return filterText
        ? data.filter(
              (item) =>
                  item.tracker_words_for_search &&
                  (item.tracker_words_for_search.startsWith(filterText.toLowerCase()) ||
                      item.tracker_words.startsWith(filterText.toLowerCase()))
          )
        : [];
};

// Gets text to display when auto completing
const getTextFromItem = (props: BallotSearchResult): string => {
    return props.tracker_words;
};

const TrackerSearchBox: React.FunctionComponent<TrackerSearchBoxProps> = () => {
    const [results, setResults] = useState<BallotSearchResult[]>([]);
    const [query, setQuery] = useState<string>('');
    const [hidden, { toggle: toggleHideDialog }] = useBoolean(false);

    useEffect(() => {
        const newResults = data.filter((d) => d.tracker_words_for_search.startsWith(query));
        setResults(newResults);
    }, [query]);

    const SelectedTrackerItem: (itemProps: IPickerItemProps<BallotSearchResult>) => JSX.Element = (
        itemProps: IPickerItemProps<BallotSearchResult>
    ) => {
        return (
            <TrackerDialog
                hidden={hidden}
                tracker={itemProps.item.tracker_words}
                onDismiss={() => toggleHideDialog()}
                confirmed={true}
            />
        );
    };

    return (
        <>
            <TrackerPicker
                onRenderSuggestionsItem={TrackerItem as any}
                onResolveSuggestions={onFilterChanged}
                getTextFromItem={getTextFromItem}
                onRenderItem={SelectedTrackerItem}
            />
        </>
    );
};

//results={ballotResults} query={query}

export default TrackerSearchBox;
