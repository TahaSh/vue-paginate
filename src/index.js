import paginate from './paginate';

var Vue = {};
var vuePaginate = {};

vuePaginate.install = function (vue) {
  Vue = vue;
  Vue.directive('paginate', paginate)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vuePaginate)
}

export {Vue};
export default vuePaginate;
module.exports = vuePaginate;
