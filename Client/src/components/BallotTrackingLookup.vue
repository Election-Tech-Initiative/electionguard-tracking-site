<template>
  <div id="lookup" onclick="">
    <label class="label">{{ $t('trackerSearchLabel') }}</label>
    <div class="control" :class="{'is-loading': isLoading}">
      <vue-autosuggest
        v-model="query"
        @input="lookupBallots"
        @selected="onSelected"
        :get-suggestion-value="getSuggestionValue"
        :inputProps="{
          id: 'autosuggest__input',
          placeholder: $t('trackerSearchInputPlaceholder'),
          class: 'input',
        }"
        :limit="limit"
        :suggestions="suggestions">
        <template slot="before-input">
          <a v-if="!isLoading && query.length > 1" class="delete" @click.prevent="reset"></a>
        </template>
        <template slot="before-suggestions">
          <h6 class="subtitle is-6">{{ $t('trackerSearchAutocompleteLabel') }}</h6>
        </template>
        <template slot-scope="{suggestion}">
          <div>
            <span class="has-text-weight-semibold">{{suggestion.item.matchedSegment}}</span><span>{{suggestion.item.unmatchedSegment}}</span>
          </div>
        </template>
        <template slot="after-suggestions" v-if="ballots.length > limit">
          <h6 class="subtitle is-6 after-suggestions">{{ $t('trackerSearchMoreResultsMessage', { moreResultsCount: ballots.length - limit}) }} </h6>
        </template>
      </vue-autosuggest>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import { VueAutosuggest } from 'vue-autosuggest';

import { BallotStatus } from '@/models/BallotStatus';

import BallotTrackingApiMixin from '@/mixins/BallotTrackingApi';

@Component({
  components: {
    VueAutosuggest
  },
})
export default class BallotTrackingLookup extends Mixins(BallotTrackingApiMixin) {
  public ballots: BallotStatus[] = [];
  public query: string = '';

  private previousQuery = '';
  private readonly MinimumSearchLength = 3;

  public getSuggestionValue(suggestion: { item: BallotStatus }): string | undefined {
    return suggestion.item.trackingId;
  }

  public get limit() {
    const isMobile = navigator.userAgent.match(
      /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i)
      !== null;
    return isMobile ? 5 : 10;
  }

  public async lookupBallots(query: string): Promise<void> {
    const pattern = this.getPatternString(query);
    if (this.isTooFewCharsToSearch(pattern)) {
      this.ballots = [];
      this.previousQuery = '';
    } else {
      if (this.shouldLookup(pattern)) {
        this.ballots = await this.queryApiForMatchingBallots(pattern);
        this.ballots.forEach((b) => {
          this.updateTrackingSegments(b, pattern);
        });
      } else {
        // TODO: If needed, optimize this so that we still keep the previously
        // returned entries in memory and reload them if the the pattern is
        // requeried (someone hits the backspace)
        this.ballots = this.ballots.filter((b) => {
          const matched = this.getPatternString(b.trackingId).startsWith(pattern);
          if (matched) {
            this.updateTrackingSegments(b, pattern);
          }
          return matched;
        });
      }

      // if no ballots found, add in the entry take user to the not found modal
      if (this.ballots.length === 0) {
        const notFoundStatus: BallotStatus = {
          trackingId: query,
          status: 404,
          matchedSegment: this.$t('trackerSearchNotFound').toString(),
        };
        this.ballots = [notFoundStatus];
      }

      this.previousQuery = pattern;
    }
  }

  public onSelected(suggestion: { item: BallotStatus }): void {
    if (!suggestion || !suggestion.item) {
      return;
    }

    const { item: ballot } = suggestion;
    if (ballot.trackingId) {
      this.$emit('selected', ballot);
      // after emitting selected up to the parent component to handle,
      // re-run the lookup again so that when modal closes, only current option exists
      this.lookupBallots(ballot.trackingId);
    }
  }

  public reset(): void {
    this.ballots = [];
    this.query = '';
  }

  public get suggestions() {
    return [{ data: this.ballots } ];
  }

  private isTooFewCharsToSearch(pattern: string) {
    return pattern.length < this.MinimumSearchLength;
  }

  private shouldLookup(pattern: string): boolean {
    // TODO: Make sure that the previous query returned less than the max items
    // allowed to be returned from a lookup.  Thus, if the query was narrowed we may
    // be missing items that weren't returne din the first query.
    return !pattern.startsWith(this.previousQuery)
        || pattern.length < this.previousQuery.length
        || !this.previousQuery
        || this.previousQuery === '';
  }

  private updateTrackingSegments(ballot: BallotStatus, pattern: string): void {
    if (!ballot || !ballot.trackingId) {
      return;
    }

    let matchedCount = 0;
    let index = 0;
    while (matchedCount < pattern.length) {
      if (ballot.trackingId[index] !== ' ') {
        // Not a space, so increment matchedCount
        matchedCount += 1;
      }
      index += 1;
    }

    ballot.matchedSegment = ballot.trackingId.substr(0, index);
    if (index < ballot.trackingId.length) {
      ballot.unmatchedSegment = ballot.trackingId.substr(index);
    } else {
      ballot.unmatchedSegment = '';
    }
  }
}
</script>

<style lang="scss">
#lookup {
  .control.is-loading:after {
    font-size: 1.8rem;
  }
  
  a.delete {
    position: absolute;
    top: 1.1rem;
    right: 1rem;
    z-index: 1;
    padding: 0.8rem;
  }

  .input {
    padding: 2rem 3rem 2rem 1.7rem;
    font-size: 1rem;
    font-weight: bold;

    &.autosuggest__input--open {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .autosuggest__results-container {
    background-color: $white;
    border: 1px solid $grey-lighter;
    border-radius: 0 0 0.5rem 0.5rem;
    margin-top: -0.5rem;

    h6 {
      margin: 1.5rem 1.5rem 0.8rem;

      &.after-suggestions {
        color: $primary;
        margin-top: 1rem;
        margin-bottom: 1.5rem;
      }
    }

    ul {
      list-style: none;
      margin: 0;

      li {
        padding: 1rem 1.5rem;

        &.autosuggest__results-item--highlighted {
          background-color: $primary;
          color: $white;
        }

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  button {
    margin-top: 1rem;
  }
}
</style>
