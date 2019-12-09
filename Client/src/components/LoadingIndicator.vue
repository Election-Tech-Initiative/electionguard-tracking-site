<template>
  <div class="loading-indicator control is-loading"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LoadingIndicator extends Vue {
}
</script>

<style lang="scss" scoped>
.loading-indicator.control.is-loading {
  display: flex;
  justify-content: center;
  height: 4rem;
  &::after {
    font-size: 3.5rem;
    left: auto;
    right: auto;
    top: 0;
    border-width: 0.2rem;
  }
}
</style>
