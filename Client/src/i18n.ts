import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';

Vue.use(VueI18n);

export const defaultLanguage = 'en'; // default language is English
let currentLanguage = defaultLanguage;
const supportedLanguages: string[][] = [];

function loadLocaleMessages(): LocaleMessages {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages: LocaleMessages = {};
  locales.keys().forEach((key: string) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
      // add to our set of supported languages
      supportedLanguages.push([locale, messages[locale].currentLanguageDisplayName as string]);
    }
  });
  return messages;
}

export function getSupportedLanguages(): string[][] {
  return supportedLanguages;
}

export const i18n = new VueI18n({
  locale: currentLanguage,
  fallbackLocale: currentLanguage,
  messages: loadLocaleMessages()
});

export function setI18nLanguage(lang: string): void {
  if (currentLanguage !== lang) {
    currentLanguage = lang;
    i18n.locale = currentLanguage;
    const html = document.querySelector('html');
    if (html) {
      html.setAttribute('lang', lang);
    }
  }
}
