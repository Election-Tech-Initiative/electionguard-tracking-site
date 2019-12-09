<template>
  <div class="section">
    <div class="container">
      <div class="content is-size-3">
        <i18n path="notFoundMessage">
          <span class="is-inline-block has-text-weight-bold">{{ $t('notFound') }}</span>
        </i18n>
      </div>
      <div class="content">        
        <router-link class="button is-dark" to='/'>{{ $t('returnHome') }}</router-link>    
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class NotFoundPage extends Vue {
}
</script>

<style>

</style>
