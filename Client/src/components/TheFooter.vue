<template>
    <footer class="footer">
        <div class="container">
            <div class="content">
                {{ $t('footerTitle', { location }) }}
                <span class="separator" />
                <span class="is-inline-block">
                {{ $t('footerCopyright') }}
                </span>
                <span class="separator" />
                <router-link 
                    class="is-inline-block has-text-weight-semibold"
                    :to="linkBallotTracking"
                >
                {{ $t('ballotTracking') }}
                </router-link>               
                <span class="separator" />
                <router-link 
                    class="is-inline-block has-text-weight-semibold"
                    :to="linkElectionResults"
                >
                {{ $t('electionResults') }}
                </router-link>
                <span class="separator" />
                <LanguageToggle />
            </div>
        </div> 
    </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import LanguageToggle from '@/components/LanguageToggle.vue';

@Component({
    components: { LanguageToggle }
})
export default class TheFooter extends Vue {
  public get linkBallotTracking(): string {
      return '/' + this.langQuery;
  }

  public get linkElectionResults(): string {
      return '/election-results' + this.langQuery;
  }

  public get langQuery(): string {
      const lang = this.$route.query.lang;
      return lang ? `?lang=${lang}` : '';
  }

  public get location(): string {
    if (this.appSettings.locationDescription2) {
      return `${this.appSettings.locationDescription}, ${this.appSettings.locationDescription2}`;
    }
    return this.appSettings.locationDescription;
  }
}
</script>

<style lang="scss" scoped>
    .footer {
        background-color: transparent;
        font-size: 0.9rem;

        @include mobile {
            padding-top: 2rem;
            padding-bottom: 2rem;
            font-size: 0.8rem;
        }

        a {
            color: $text;

            &.router-link-exact-active {
                color: $primary;
            }
        }

        .separator {
            &::before {
                content: '\00b7';
                padding: 0 0.5rem;
            }
        }

        .language-toggle {
            display: inline-block;
        }
    }
</style>

