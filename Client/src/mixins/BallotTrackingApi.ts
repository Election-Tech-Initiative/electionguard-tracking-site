import Vue from 'vue';
import Component from 'vue-class-component';

import { BallotStatus } from '@/models/BallotStatus';

@Component
export default class BallotTrackingApiMixin extends Vue {
  public isLoading = false;

  public getPatternString(value: string | undefined) {
    return !value ? '' : value.replace(/\s|-/g, '').toLowerCase();
  }

  public async queryApiForMatchingBallots(pattern: string): Promise<BallotStatus[]> {
    try {
      // TODO: Look at putting a debounce delay in here to make sure we aren't typing rapidly.
      const url = `${this.appSettings.apiUrl}/ballot/${pattern}`;
      this.isLoading = true;
      // console.log ('querying url - ' + url);
      const response = await this.$http.get<BallotStatus[]>(url);
      if (response.status === 200) {
        // console.log('Got 200, setting ballots to: ');
        // console.log(response.data);
        return response.data;
      } else {
        console.log(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`Error while checking ballots that match pattern`);
      console.log(error);
    } finally {
      this.isLoading = false;
    }
    return [];
  }
}
