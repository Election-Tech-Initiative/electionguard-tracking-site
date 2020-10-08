import { InternationalizedText } from './internationalizedText';

export type ElectionState = 'New' | 'Open' | 'Closed' | 'Published';

export interface Election {
    id: string;
    election_description: ElectionDescription;
    state: ElectionState;
}

export interface ElectionDescription {
    election_scope_id: string;
    start_date: string;
    end_date: string;
    candidates: Candidate[];
    contests: ContestDescription[];
    name?: InternationalizedText;
}

export interface ContestDescription {
    object_id: string;
    electoral_district_id: string;
    sequence_order: number;
    number_elected: number;
    name: string;
    ballot_selections: SelectionDescription[];
    ballot_title?: InternationalizedText;
    ballot_subtitle?: InternationalizedText;
}

export interface Candidate {
    object_id: string;
    ballot_name: InternationalizedText;
}

export interface SelectionDescription {
    object_id: string;
    candidate_id: string;
    sequence_order: number;
}
