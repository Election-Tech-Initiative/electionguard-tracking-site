import { ElectionObjectBase } from './election_object_base';

export interface Language {
    value: string;
    language: string;
}

export interface InternationalizedText {
    text: Language[];
}

export interface SelectionDescription extends ElectionObjectBase {
    candidate_id: string;
    sequence_order: number;
}

export interface Candidate extends ElectionObjectBase {
    ballot_name: InternationalizedText;
}

export interface ContestDescription extends ElectionObjectBase {
    electoral_district_id: string;
    sequence_order: number;
    number_elected: number;
    name: string;
    ballot_selections: SelectionDescription[];
    ballot_title?: InternationalizedText;
    ballot_subtitle?: InternationalizedText;
}

export interface ElectionDescription {
    election_scope_id: string;
    start_date: string;
    end_date: string;
    candidates: Candidate[];
    contests: ContestDescription[];
    name?: InternationalizedText;
}
