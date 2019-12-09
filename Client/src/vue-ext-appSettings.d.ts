/**
 * Extend Vue global variable to include our appSettings
 */
import Vue from 'vue/types/vue';
import AppSettings from './appSettings';

declare module 'vue/types/vue' {
  interface Vue {
    appSettings: AppSettings;
  }
}
