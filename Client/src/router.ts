import Vue from 'vue';
import Router, { Location, Route } from 'vue-router';

import { defaultLanguage, setI18nLanguage } from './i18n';

import BallotTracking from './views/BallotTracking.vue';
import ElectionResults from './views/ElectionResults.vue';
import NotFoundPage from './views/NotFoundPage.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Ballot Tracking',
      component: BallotTracking,
    },
    {
      path: '/track/:ballotId',
      name: 'Ballot Tracking Results',
      component: BallotTracking,
      props: true,
    },
    {
      path: '/election-results',
      name: 'Election Results',
      component: ElectionResults,
    },
    {
      path: '*',
      name: '- 404',
      component: NotFoundPage,
    }
  ],
});

router.beforeEach((to: Route, from: Route, next: (to?: Location | void) => void) => {
  // use the language from the routing param or default language
  const fromLanguage = from.query.lang;
  let toLanguage = to.query.lang;
  let shouldAppendLang = false;

  if (fromLanguage && !toLanguage) {
    // apply existing lang set in from url query to the empty lang query in the to url
    shouldAppendLang = true;
    toLanguage = fromLanguage;
  } else if (!toLanguage) {
    toLanguage = defaultLanguage;
  }

  setI18nLanguage(toLanguage as string);

  if (shouldAppendLang) {
    next({ ...to, query: { lang: toLanguage } });
  } else {
    next();
  }
});

export default router;
