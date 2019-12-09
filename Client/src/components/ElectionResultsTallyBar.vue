<template>
  <div id="bar" class="bar-wrapper" :class="{'first': isFirst}">
    <div class="bar" :style="{'width': percentage}"></div>
    <div
      class="bar-text"
      :style="{'min-width': percentage}"
    >{{count}} ({{percentage}})</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ElectionResultsTallyBar extends Vue {
  @Prop() public isFirst!: boolean;
  @Prop() public count!: string;
  @Prop() public percentage!: string;
}
</script>

<style lang="scss" scoped>
.first {
  font-weight: bold;

  .bar {
    background-color: $primary;
  }
  .bar-text {
    color: $white;
  }
}

.bar-wrapper {
  position: relative;
}

.bar {
  min-width: 0.1rem;
  height: 2rem;
  background-color: $white-ter;
}

.bar-text {
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  text-align: right;
  padding: 0.2rem 0.6rem;
  text-shadow: 0.05rem 0.05rem 0.1rem $grey-darker;
}
</style>
