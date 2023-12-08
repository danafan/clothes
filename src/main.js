import Vue from 'vue'
import App from '@/App.vue'

import store from '@/store'

import '@/fonts/font.css'
import router from '@/router'

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
