<template>
  <div id="app">
    <TheHeader :pageTitle="pageTitle" />
    <router-view />
    <TheFooter />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue';

@Component({
  components: {
    TheHeader,
    TheFooter,
  },
})
export default class App extends Vue {
  private locationName: string = '';
  private pageTitle?: string = '';

  constructor() {
    super();
    this.locationName = this.appSettings.locationDescription;
  }

  @Watch('$route')
  public onRouteChanged(value: string, oldValue: string) {
    this.updatePageTitle();
  }

  public created() {
    this.updatePageTitle();
  }

  public updatePageTitle() {
    if (this.$route && this.$route.name
        && typeof this.$route.name === 'string') {
      this.pageTitle = `${this.locationName} ${this.$route.name}`;
      document.title = this.pageTitle;
    } else {
      this.pageTitle = undefined;
      console.error('No title set for path [%s]', this.$route.path);
    }
  }
}
</script>

<style lang="scss">

#app {
  @include mobile {
    font-size: 0.9rem;
  }

  &::before {
    display: block;
    content: '';
    width: 100%;
    height: 1.5rem;
    background-color: $grey-dark;
    margin-bottom: 2rem;

    @include mobile {
      height: 1.3rem;
      margin-bottom: 1.5rem;
    }
  }
}

.component-content:not(:last-child) {
  margin: 2.5rem 0;

  @include mobile {
      margin: 2rem 0;
  }
}

</style>
