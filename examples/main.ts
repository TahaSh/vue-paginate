import Vue from 'vue'
import App from './App.vue'
import VuePaginate from '../src'

Vue.use(VuePaginate)

new Vue({
  el: '#app',
  render: h => h(App)
})
