<template>
  <div>
    <div v-if="shouldDisplayGuard" class="section">
      <div class="container">
        <div class="content">
            <p>
                {{ $t('preElectionMessage', { formattedElectionDate }) }}
            </p>
        </div>
      </div>
    </div>
    <slot v-else />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import moment from 'moment';

@Component
export default class PreElectionGuard extends Vue {
  public formattedElectionDate: string = '';

  public shouldDisplayGuard: boolean = true;

  public created(): void {
    this.shouldDisplayGuard = !(this.appSettings.electionClosed === 'true');
    if (this.shouldDisplayGuard) {
      // TODO: replace message based on $route?
      const electionDate = moment(new Date(this.appSettings.electionDate));
      this.formattedElectionDate = electionDate.format('MMMM Do, YYYY');
    }
  }
}
</script>

