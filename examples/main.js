import Vue from 'vue'
import App from './App'
import VuePaginate from 'vue-paginate'

Vue.use(VuePaginate)

new Vue({
  el: '#app',
  render: h => h(App)
})