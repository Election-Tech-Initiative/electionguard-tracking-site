<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="box">
        <LoadingIndicator v-if="isLoading" />
        <div v-else-if="selectedBallot"
          :class="{
            'counted': selectedBallot.status === 0,
            'not-found': selectedBallot.status === 404,
            'discarded': selectedBallot.status === -1, // assuming status of -1 for now
          }">

          <h1 class="title">
            <span v-if="selectedBallot.status === 0">{{ $t('ballotCountedTitle') }}</span>
            <span v-else-if="selectedBallot.status === 404">{{ $t('ballotNotFoundTitle') }}</span>
            <span v-else-if="selectedBallot.status === -1">{{ $t('ballotDiscardedTitle') }}</span>
          </h1>

          <div class="content">
            <div v-if="selectedBallot.status === 0">
              <p>{{ $t('ballotCountedTopMessage', {location: appSettings.locationDescription}) }}</p>
            </div>
            <div v-else-if="selectedBallot.status === 404">
              <p>{{ $t('ballotNotFoundTopMessage', {location: appSettings.locationDescription}) }}</p>
              <ol>
                <li>{{ $t('ballotNotFoundListItem1') }}</li>
                <li>
                  <i18n path="ballotNotFoundListItem2">
                    <a :href="appSettings.commissionContact">{{ $t('ballotNotFoundListItem2LinkLabel') }}</a>
                  </i18n>
                </li>
              </ol>
            </div>
            <div v-else-if="selectedBallot.status === -1">
              <p>{{ $t('ballotDiscardedTopMessage', {location: appSettings.locationDescription}) }}</p>
            </div>
          </div>

          <div class="content ballot-status">
            <div class="ballot-data has-text-weight-semibold">
              {{selectedBallot.trackingId}}
            </div>
            <div v-if="selectedBallot.status === 0 || selectedBallot.status === -1"
              class="ballot-status-bottom">
              <div class="ballot-data">
                <span class="has-text-weight-semibold">{{ $t('ballotLocationLabel') }}</span> {{selectedBallot.location}}
              </div>
              <div class=ballot-data>
                <span class="has-text-weight-semibold">{{ $t('ballotVoteTimeLabel') }}</span> {{approximateCastTime}}
              </div>
            </div>
          </div>
          
          <div class="content">
            <div v-if="selectedBallot.status === 0">
              <i18n tag="p" path="ballotCountedBottomMessage">
                <a href="https://aka.ms/ElectionGuardMoreInfo">{{ $t('ballotClickHere') }}</a>
              </i18n>
            </div>
            <div v-else-if="selectedBallot.status === 404">
              <i18n tag="p" path="ballotNotFoundBottomMessage">
                <a href="https://aka.ms/ElectionGuardMoreInfo">{{ $t('ballotClickHere') }}</a>
              </i18n>
            </div>
            <div v-else-if="selectedBallot.status === -1">
              <i18n tag="p" path="ballotDiscardedBottomMessage">
                <a href="https://aka.ms/ElectionGuardMoreInfo">{{ $t('ballotClickHere') }}</a>
              </i18n>
            </div>
          </div>
          
          <LanguageToggle />
          <a class="button is-dark has-text-weight-bold" href="#" @click.prevent="$emit('close')">
            {{ $t('close') }}
          </a>

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import moment from 'moment-timezone';

import { BallotStatus } from '@/models/BallotStatus';
import LanguageToggle from '@/components/LanguageToggle.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';

@Component({
  components: {
    LanguageToggle,
    LoadingIndicator,
  },
  props: {
    isActive: {
      type: Boolean
    }
  }
})
export default class BallotTrackingModal extends Vue {
  @Prop() public isActive?: boolean;
  @Prop() public isLoading?: boolean;
  @Prop() public selectedBallot?: BallotStatus;

  private readonly MinuteInterval = 5;

  public get approximateCastTime(): string {
    if (!!this.selectedBallot) {
      const castTime = moment.utc(this.selectedBallot.approximateCastTime);
      const minutes = castTime.minutes();
      const roundedMins = Math.round(minutes / this.MinuteInterval) * this.MinuteInterval;
      const approximateDate = castTime.minutes(roundedMins);
      const tz = moment.tz.guess();
      const date = approximateDate.local().tz(tz).format('MMMM D, YYYY h:mm a zz');
      return date;
    }
    return '';
  }
}
</script>

<style lang="scss" scoped>
.language-toggle {  
    float: right;
    margin-bottom: 1.5rem;
}

.box {
  border-radius: 0.2rem;
  padding: 2rem;

  @include mobile {
    padding: 1.5rem;
  }
}

.button.is-dark {
  font-size: 0.9rem;
  padding: 1.2rem 2rem;
}

@include tablet {
  .modal-content {
    width: 75%;
    max-width: 1080px;
  }
}

// default colors to NOT FOUND version of design
h1.title {
  display: flex;
  align-items: center;
  color: $primary;

  &::before {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    content: '?';
    color: $white;
    font-size: 2.5rem;
    background-color: $primary;
    border-radius: 50%;
    width: 4rem;
    height: 4rem;
    margin-right: 1.5rem;
  }

  @include mobile {
    font-size: 1.4rem;

    &::before {
      font-size: 2rem;
      margin-right: 1rem;
      width: 3rem;
      height: 3rem;
    }
  }
}

.ballot-status {
  > div {
    font-size: 0.9rem;
    border: 0.1rem solid $primary;
    padding: 1rem 1.1rem 0 1.1rem;
  }

  .ballot-status-bottom {
    border-top: none;
  }

  .ballot-data {
    padding-bottom: 1rem;
  }
}

.counted {
  h1.title {
    color: $success;

    &::before {
      content: '\2713';
      background-color: $success;
    }
  }

  .ballot-status {
    > div {
      border-color: $success;
    }
  }
}

.discarded {
  h1.title {
    color: $danger;
    &::before {
      content: 'X';
      background-color: $danger;
    }
  }

  .ballot-status {
    > div {
      border-color: $danger;
    }
  }
}
</style>
