import Vue from 'vue';
import VuePaginate from 'vue-paginate';
import App from './App';

Vue.use(VuePaginate);

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App),
});
