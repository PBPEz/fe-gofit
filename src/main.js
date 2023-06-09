import Vue from 'vue'
import App from './App.vue'
import vuetify from "@/plugins/vuetify";
import router from "./router";
import axios from 'axios';
import Chart from 'chart.js/auto';

// eslint-disable-next-line vue/multi-word-component-names

Vue.config.productionTip = false

Vue.prototype.$http = axios;
Vue.prototype.$api = 'http://127.0.0.1:8000/api';
Vue.prototype.$baseUrl = 'http://127.0.0.1:8000';
new Vue({
  vuetify,
  router,
  Chart,
  render: (h) => h(App),
}).$mount("#app")
