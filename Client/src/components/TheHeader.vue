<template>
    <header class="header">
        <div class="container">
            <div class="is-flex">
                <img class="election-logo" src="/logo.png" :alt="$t('logoAltText', { location: appSettings.locationDescription })">
                <span class="title">{{pageTitle}}</span>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TheHeader extends Vue {
    @Prop() public readonly pageTitle!: string;
}
</script>

<style lang="scss" scoped>

.is-flex {
    align-items: center;
    @include touch {
        margin: 0 1rem;
    }
}

.election-logo {
  width: 10rem;
  height: 10rem;

  @include mobile {
      width: 6rem;
      height: 6rem;
  }
}

.title {
    font-size: 2.2rem;
    margin-left: 2.6rem;
    @include mobile {
        font-size: 1.7rem;
        margin-left: 0.5rem;
    }
}

</style>
