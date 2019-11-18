<template>
  <PreElectionGuard>
    <div class="section">
      <div class="container">
        <div class="content">
        </div>
      </div>
    </div>

    <LoadingIndicator v-if="isLoading" />
    <div class="section results" v-else-if="showElectionResults">
      <div class="container">
        <div class="content">
          <ElectionResultsTally :electionResults="electionResults" />
        </div>
      </div>
    </div>
  </PreElectionGuard>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { ElectionSummary } from '@/models/ElectionSummary';
import { BallotEntry } from '@/models/BallotEntry';
import { Tally } from '@/models/Tally';

import ElectionResultsTally from '@/components/ElectionResultsTally.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import PreElectionGuard from '@/components/PreElectionGuard.vue';

@Component({
  components: {
    ElectionResultsTally,
    LoadingIndicator,
    PreElectionGuard,
  },
})
export default class ElectionResults extends Vue {
  public isLoading: boolean = true;

  // This has to be initialized in order for it to be reactive
  public electionResults: ElectionSummary = {
    isComplete: false,
    ballotEntries: []
  };

  constructor() {
    super();

    this.queryResults();
  }

  public get showElectionResults(): boolean {
    return !!this.electionResults && this.electionResults.isComplete;
  }

  public async queryResults(): Promise<void> {
    this.isLoading = true;
    try {
      const url = `${this.appSettings.apiUrl}/summary`;
      const response = await this.$http.get(url);
      if (response.status === 200) {
        this.electionResults = response.data;
      } else {
        console.log(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`Error while getting election results summary`);
      console.log(error);
    }
    this.isLoading = false;
  }
}
</script>

<style lang="scss" scoped>
.section.results {
  background-color: $white;
}
</style>
