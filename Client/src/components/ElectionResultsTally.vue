<template>
  <div id="tally">
    <h2 class="title">
      {{ $t('electionResults') }}
    </h2>
    <div v-for="(item) in electionResults.ballotEntries" :key="item.raceId">
      <hr class="hr" />
      <h3 class="title">{{item.name}}</h3>
      <div>
        <div class="columns"
          v-for="(tally, index) in item.tallies"
          :key="tally.selectionId">
          <div class="name column is-one-quarter">
            {{tally.name}}
            <div class="party">{{tally.party}}</div>
          </div>
          <div class="votes column">
            <ElectionResultsTallyBar
              :isFirst="index === 0"
              :count="tally.voteCount"
              :percentage="getPercentage(tally.voteCount, item.tallies)"
            />
          </div>
        </div>
      </div>
    </div>
    <button class="button is-success tooltip" :data-tooltip="$t('featureNotAvailable')">{{ $t('downloadElectionTally') }}</button>    
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import ElectionResultsTallyBar from '@/components/ElectionResultsTallyBar.vue';
import { ElectionSummary } from '@/models/ElectionSummary';
import { Tally } from '@/models/Tally';

@Component({
  components: {
    ElectionResultsTallyBar,
  }
})
export default class ElectionResultsTally extends Vue {
  @Prop() public electionResults!: ElectionSummary;

  public getPercentage(count: number, tallies: Tally[]): string {
    const totalVotes = tallies
      .map((t) => t.voteCount)
      .reduce((total, votes) => (total || 0) + (votes || 0));
    if (totalVotes) {
      const percentage = (count / totalVotes) * 100;
      return `${percentage.toFixed(1)}%`;
    }
    return '0%';
  }
}
</script>

<style lang="scss" scoped>
.button.is-success {
  margin-top: 5rem;
}

.columns {
  
  .name {
    padding-left: 4rem;

    @include touch {
      padding-left: 0.75rem;
    }
  }

  .party {
    color: $grey-dark;
    font-size: 0.8rem;
    font-weight: normal;
  }
}
</style>
