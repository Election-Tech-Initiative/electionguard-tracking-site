import { ElectionObjectBase } from './election_object_base';

export interface PlaintextTallySelection extends ElectionObjectBase {
    tally: number;
}

export interface PlaintextTallyContest extends ElectionObjectBase {
    selections: {
        [object_id: string]: PlaintextTallySelection;
    };
}

export interface PlaintextTally extends ElectionObjectBase {
    contests: {
        [object_id: string]: PlaintextTallyContest;
    };
}
