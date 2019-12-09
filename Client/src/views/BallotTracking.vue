<template>
  <PreElectionGuard>
    <div class="section">
      <div class="container">
        <div class="content">
          {{ $t('ballotTrackingInfoMessage', { electionEnded, location }) }}
        </div>
        <div class="component-content">
          <BallotTrackingLookup @selected="onBallotSelected" />
        </div>
        <div class="component-content">
          <BallotTrackingQRScanner />
        </div>
      </div>
      <BallotTrackingModal
        :isActive="showModal"
        :isLoading="isLoading"
        :selectedBallot="selectedBallot"
        @close="closeBallotModal"
      />
    </div>
  </PreElectionGuard>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from 'vue-property-decorator';
import moment from 'moment';

import { BallotStatus } from '@/models/BallotStatus';

import BallotTrackingApiMixin from '@/mixins/BallotTrackingApi';

import BallotTrackingLookup from '@/components/BallotTrackingLookup.vue';
import BallotTrackingModal from '@/components/BallotTrackingModal.vue';
import BallotTrackingQRScanner from '@/components/BallotTrackingQRScanner.vue';
import PreElectionGuard from '@/components/PreElectionGuard.vue';

@Component({
  components: {
    BallotTrackingLookup,
    BallotTrackingModal,
    BallotTrackingQRScanner,
    PreElectionGuard
  }
})
export default class BallotTracking extends Mixins(BallotTrackingApiMixin) {
  @Prop() public ballotId?: string;

  public electionEnded: string = '';
  public location: string = '';
  public selectedBallot: BallotStatus | null = null;
  public showModal: boolean = false;

  public created(): void {
    // TODO: Convert the date formatting to a filter so it can be reused
    const dateEnded = moment(new Date(this.appSettings.electionDate));
    this.electionEnded = dateEnded.format('MMMM Do, YYYY');
    this.location = this.appSettings.locationDescription;
    this.handleBallotId();
  }

  public closeBallotModal(): void {
    this.selectedBallot = null;
    this.$router.push('/');
  }

  @Watch('ballotId')
  public onBallotIdChanged(value: string, oldValue: string): void {
    this.handleBallotId();
  }

  public onBallotSelected(ballot: BallotStatus): void {
    this.selectedBallot = ballot;
    this.$router.push(`/track/${ballot.trackingId}`);
  }

  private handleBallotId(): void {
    this.showModal = this.ballotId !== undefined;
    if (this.ballotId && !this.selectedBallot) {
      this.lookupBallot(this.ballotId);
    }
  }

  private async lookupBallot(ballotId: string): Promise<void> {
    const pattern = this.getPatternString(ballotId);
    const ballots = await this.queryApiForMatchingBallots(pattern);
    if (ballots.length > 0) {
      // lookup returned at least 1 ballot from the query, there _should_ only be 1 result,
      // so use it to populate the selectedBallot
      // TODO: handle a case where the ballotId returns multiple results instead?
      this.selectedBallot = ballots[0];
    } else if (ballotId === 'discarded') {
      // TODO: FOR DEMO PURPOSES ONLY!! Remove this condition logic after we have known discarded ids
      this.selectedBallot = {
        trackingId: ballotId,
        status: -1,
        location: 'dummy location',
        approximateCastTime: new Date()
      };
    } else {
      // if no results are found, stub the selectedBallot with the entry for the ballotId and a 404 status
      // so that the modal can handle the 'Not Found' case
      this.selectedBallot = {
        trackingId: ballotId,
        status: 404
      };
    }
  }
}
</script>
