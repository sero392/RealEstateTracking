import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import moment from 'moment';
import '../src/assets/main.css'
import statusPlugin from './plugins/statusPlugin';

Vue.prototype.$moment = moment;
Vue.config.productionTip = false;
Vue.use(statusPlugin)
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
