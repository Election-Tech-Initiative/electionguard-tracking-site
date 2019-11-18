export class BallotStatus {
  public trackingId?: string;
  public status?: number;
  public location?: string;
  public approximateCastTime?: Date;
  public details?: string[];

  public matchedSegment?: string;
  public unmatchedSegment?: string;
}
