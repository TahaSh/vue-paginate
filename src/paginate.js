import {Vue} from './index';
import utils from './utils';
import LimitedLinksGenerator from './LimitedLinksGenerator';

/**
 * Each instance contains these state variables:
 *
 * list: {
 *   perPage: 0,
 *   numberOfPages: 0,
 *   currentPage: 0,
 *   initial: 0 // the initial page number in limited links
 * }
 *
 * listName: ''
 *
 * originalList: {} // The initial list (before it's sliced)
 */
export default {
  twoWay: true,

  params: ['limit'],

  bind () {

    // Turn off warnings (because we're using vm.$set).
    Vue.config.silent = true;

    var vm = this.vm;
    this.listName = this.expression;
    var perPage = this.getPerPage();
    var limit = +this.params.limit;

    if (!vm[this.listName]) {
      throw new Error('[vue-paginate] the list name "' + this.listName + '" is not defined in your vm instance.');
    }

    this.originalList = vm[this.listName];

    // Set the full version on the vm
    vm.$set('full' + utils.capitalize(this.listName), this.originalList);

    // Update the original list when the user changes the full list.
    vm.$watch('full' + utils.capitalize(this.listName), (newVal, oldVal) => {
      this.originalList = newVal;
      this.setNumberOfPages(this.originalList.length);
      vm['refresh' + utils.capitalize(this.listName) + 'Page']();
    });

    if (this.isPerPageDynamic()) {
      vm.$watch(this.arg, (newVal) => {
        this.list.perPage = +newVal <= 0 ? 1 : +newVal;
        vm['refresh' + utils.capitalize(this.listName) + 'Page']();
      });
    }

    this.list = { currentPage: 0, initial: 0, perPage };

    // Set links array.
    this.setNumberOfPages(this.originalList.length);

    // Set links array for limited navs (if used).
    this.setLimitedPages(limit);

    // To check if the number of links in the nav is sufficient to be displayed.
    vm.$set('has' + utils.capitalize(this.listName) + 'Links', this.list.numberOfPages > 1);

    vm['change' + utils.capitalize(this.listName) + 'Page'] = (page) => {
      // Reset the list with original data for two reasons:
      // 1. To change it, so the update hook gets triggered.
      // 2. To slice it with new positions from the beginning.
      vm[this.listName] = this.originalList;

      this.list.currentPage = typeof page == 'number' ? page - 1 : page;

      this.setLimitedPages(limit);
      this.update(this.originalList);
    };

    // Another way to navigate pages (Next & Prev)
    vm['next' + utils.capitalize(this.listName) + 'Page'] = () => {
      vm[this.listName] = this.originalList;

      this.list.currentPage = (this.list.currentPage + 1 < this.list.numberOfPages) ?
        this.list.currentPage + 1 :
        this.list.currentPage;

      this.update(this.originalList);
    };

    vm['prev' + utils.capitalize(this.listName) + 'Page'] = () => {
      vm[this.listName] = this.originalList;

      this.list.currentPage = (this.list.currentPage - 1 > 0) ?
        this.list.currentPage - 1 :
        0;

      this.update(this.originalList);
    };

    vm['refresh' + utils.capitalize(this.listName) + 'Page'] = () => {
      vm['change' + utils.capitalize(this.listName) + 'Page'](1);
    };

    // Turn on warnings back
    Vue.config.silent = false;
  },

  update (list) {
    // Refresh number of pages (useful in case you're filtering the list)
    this.setNumberOfPages(list.length);

    this.list.currentPage = this.list.currentPage >= this.list.numberOfPages ?
      this.list.numberOfPages - 1 : 
      this.list.currentPage;

    // Apply the current page from the list state to the vm.
    this.setCurrentPage();

    var index = this.list.currentPage * this.list.perPage;

    this.set(list.slice(index, index + this.list.perPage));
  },

  setNumberOfPages (length) {
    let numberOfItems = length;
    this.list.numberOfPages = Math.ceil(numberOfItems / this.list.perPage);

    var links = utils.generateLinksArray(1, this.list.numberOfPages);

    this.vm.$set(this.listName + 'Links', links);
  },

  setCurrentPage () {
    Vue.config.silent = true;
    this.vm.$set('current' + utils.capitalize(this.listName) + 'Page', this.list.currentPage + 1);
    this.vm.$set('has' + utils.capitalize(this.listName) + 'Links', this.list.numberOfPages > 1);
    Vue.config.silent = false;
  },

  setLimitedPages (limit) {
    let links =
        new LimitedLinksGenerator(
          this.vm,
          this.list,
          this.listName
        ).generate(limit);

    this.vm.$set('limited' + utils.capitalize(this.listName) + 'Links', links);
  },

  getPerPage () {
    let vm = this.vm;
    let arg = this.arg;
    let regex = new RegExp(arg, 'i')

    if (! this.isPerPageDynamic()) {
      return +arg
    }

    if (isDynamicPerPageValid()) {
      this.arg = getDynamicArg();
      return +vm[this.arg];
    }

    return 1;

    function getDynamicArg() { return Object.keys(vm.$data).find(a => a.match(regex)) }
    function isDynamicPerPageValid () { return +vm[getDynamicArg()] > 0; }
  },

  isPerPageDynamic () {
    return ! Number.isInteger(Number.parseInt(this.arg));
  }

}
