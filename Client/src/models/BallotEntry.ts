import { Tally } from './Tally';

export class BallotEntry {
  public raceId?: string;
  public name?: string;
  public description?: string;
  public tallies?: Tally[];
}
