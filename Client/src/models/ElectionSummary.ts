import { BallotEntry } from './BallotEntry';

export class ElectionSummary {
  public isComplete!: boolean;
  public ballotEntries?: BallotEntry[];
}
