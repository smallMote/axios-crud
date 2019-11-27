import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import $bus from './utils/bus'
import App from './App.vue'
$bus.$on('createError', function(response) {
  console.log(response) // eslint-disable-line
})
Vue.use(VueCompositionApi)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
