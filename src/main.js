// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueMoment from 'vue-moment'
import Vue2Filters from 'vue2-filters'

Vue.config.productionTip = false

import 'vuetify/dist/vuetify.min.css'

import {
  store
} from './vuex/store'

Vue.use(Vuetify)
Vue.use(VueMoment)
Vue.use(Vue2Filters)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
