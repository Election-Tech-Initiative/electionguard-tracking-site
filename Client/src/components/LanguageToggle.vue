<template>
    <div class="language-toggle">
        <span class="language-label">
            {{ $t("languageLabel") }}
        </span>
        <div class="locale-changer select is-small">
            <select v-model="selectedLanguage" @change="onLanguageChange">
                <option v-for="(lang, i) in supportedLanguages" :key="`lang${i}`" :value="lang[0]">{{ lang[1] }}</option>
            </select>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import { getSupportedLanguages } from '@/i18n';

@Component
export default class LanguageToggle extends Vue {
  public supportedLanguages = getSupportedLanguages();
  public selectedLanguage: string | undefined;

  @Watch('$i18n.locale')
  public onLocaleChange(value: string, oldValue: string) {
      if (value !== oldValue) {
        this.selectedLanguage = value;
      }
  }

  public created(): void {
      this.selectedLanguage = this.$i18n.locale;
  }

  public onLanguageChange(): void {
    const query = `?lang=${this.selectedLanguage}`;
    this.$router.push(`${this.$route.path}${query}`);
  }
}
</script>

<style lang="scss" scoped>
    .language-label {
        color: $dark;
        font-weight: 600;
    }
    .locale-changer {
        vertical-align: middle;
    }
</style>