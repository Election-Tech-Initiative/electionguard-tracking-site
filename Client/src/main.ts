import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

import App from './App.vue';
import AppSettings from './appSettings';
import router from './router';
import { i18n } from './i18n';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);

// The following bootstraps the Vue application.
// Before it does so, it retrieves the appSettings.json file from
// the server and adds the resulting AppSettings object onto
// the VueContructor object.  This allows the appSettings property
// to be accessed from any component. The Vue object is created
// after the download and processing of appSettings.json is complete.

// This is done by extending the Vue objects interfaces
// See: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
// The interface augmentation is done in 'vue-ext-appSettings.d.ts'.
(async () => {
  const response = await axios.get<AppSettings>('/appsettings.json?nocache=' + (new Date()).getTime());
  Vue.prototype.appSettings = response.data;

  new Vue({
    router,
    i18n,
    render: (h) => h(App)
  }).$mount('#app');
})();
