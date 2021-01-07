import Vue from 'vue';

const warn = (msg, vm, type = 'error') => {
    if (hasConsole) {
        console[type](`[vue-paginate]: ${msg} ` + (vm ? formatLocation(formatComponentName(vm)) : ''));
    }
};
const formatComponentName = (vm) => {
    if (vm.$root === vm) {
        return 'root instance';
    }
    const options = vm.$options;
    const name = vm._isVue
        ? vm.$options.name || options._componentTag
        : vm.name;
    return ((name ? `component <${name}>` : `anonymous component`) +
        (vm._isVue && options.__file ? ` at ${options.__file}` : ''));
};
const hasConsole = typeof console !== 'undefined';
const formatLocation = (str) => {
    if (str === 'anonymous component') {
        str += ` - use the "name" option for better debugging messages.`;
    }
    return `\n(found in ${str})`;
};

var Paginate = Vue.extend({
  name: 'paginate',
  props: {
    name: {
      type: String,
      required: true
    },
    list: {
      type: Array,
      required: true
    },
    per: {
      type: Number,
      default: 3,
      validator(value) {
        return value > 0
      }
    },
    tag: {
      type: String,
      default: 'ul'
    },
    container: {
      type: Object /*as PropType<Vue | null>*/,
      default: null
    }
  },
  data() {
    return {
      initialListSize: this.list.length
    }
  },
  computed: {
    parent() {
      return this.container ? this.container : this.$parent
    },
    currentPage: {
      get() {
        if (this.parent.paginate[this.name]) {
          return this.parent.paginate[this.name].page
        }

        return 0
      },
      set(page) {
        this.parent.paginate[this.name].page = page;
      }
    },
    pageItemsCount() {
      const numOfItems = this.list.length;
      const first = this.currentPage * this.per + 1;
      const last = Math.min((this.currentPage * this.per) + this.per, numOfItems);
      return `${first}-${last} of ${numOfItems}`
    },

    lastPage() {
      return Math.ceil(this.list.length / this.per)
    }
  },
  mounted() {
    if (this.per <= 0) {
      warn(`<paginate name="${this.name}"> 'per' prop can't be 0 or less.`, this.parent);
    }
    if (!this.parent.paginate[this.name]) {
      warn(`'${this.name}' is not registered in 'paginate' array.`, this.parent);
      return
    }
    this.paginateList();
  },
  watch: {
    currentPage() {
      this.paginateList();
    },
    list() {
      if (this.currentPage >= this.lastPage) {
        this.currentPage = this.lastPage - 1;
      }
      this.paginateList();
    },
    per() {
      this.currentPage = 0;
      this.paginateList();
    }
  },
  methods: {
    paginateList() {
      const index = this.currentPage * this.per;
      const paginatedList = this.list.slice(index, index + this.per);
      this.parent.paginate[this.name].list = paginatedList;
    },
    goToPage(page) {
      const lastPage = Math.ceil(this.list.length / this.per);
      if (page > lastPage) {
        warn(`You cannot go to page ${page}. The last page is ${lastPage}.`, this.parent);
        return
      }
      this.currentPage = page - 1;
    }
  },
  render(h) {
    return h(this.tag, {}, this.$slots.default)
  }
});

const LEFT_ARROW = '«';
const RIGHT_ARROW = '»';
const ELLIPSES = '…';

class LimitedLinksGenerator {
    constructor(listOfPages, currentPage, limit) {
        this.listOfPages = listOfPages;
        this.lastPage = listOfPages.length - 1;
        this.currentPage = currentPage === this.lastPage
            ? this.lastPage - 1
            : currentPage;
        this.limit = limit;
    }
    generate() {
        const firstHalf = this._buildFirstHalf();
        let secondHalf = this._buildSecondHalf();
        return [...firstHalf, ...secondHalf];
    }
    _buildFirstHalf() {
        const firstHalf = this._allPagesButLast()
            .slice(this._currentChunkIndex(), this._currentChunkIndex() + this.limit);
        // Add backward ellipses with first page if needed
        if (this.currentPage >= this.limit) {
            firstHalf.unshift(ELLIPSES);
            firstHalf.unshift(0);
        }
        // Add ellipses if needed
        if (this.lastPage - this.limit > this._currentChunkIndex()) {
            firstHalf.push(ELLIPSES);
        }
        return firstHalf;
    }
    _buildSecondHalf() {
        const secondHalf = [this.lastPage];
        return secondHalf;
    }
    _currentChunkIndex() {
        const currentChunk = Math.floor(this.currentPage / this.limit);
        return currentChunk * this.limit;
    }
    _allPagesButLast() {
        return this.listOfPages.filter(n => n !== this.lastPage);
    }
}

var PaginateLinks = Vue.extend({
  name: 'paginate-links',
  props: {
    for: {
      type: String,
      required: true
    },
    limit: {
      type: Number,
      default: 0
    },
    simple: {
      type: Object,
      default: null,
      validator (obj) {
        return obj.prev && obj.next
      }
    },
    stepLinks: {
      type: Object,
      default: () => {
        return {
          prev: LEFT_ARROW,
          next: RIGHT_ARROW
        }
      },
      validator (obj) {
        return obj.prev && obj.next
      }
    },
    showStepLinks: {
      type: Boolean
    },
    hideSinglePage: {
      type: Boolean
    },
    classes: {
      type: Object,
      default: null
    },
    async: {
      type: Boolean,
      default: false
    },
    container: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      listOfPages: [],
      numberOfPages: 0,
      target: null
    }
  },
  computed: {
    parent () {
      return this.container ? this.container.el : this.$parent
    },
    state () {
      return this.container ? this.container.state : this.$parent.paginate[this.for]
    },
    currentPage: {
      get () {
        if (this.state) {
          return this.state.page
        }
      },
      set (page) {
        this.state.page = page;
      }
    }
  },
  mounted () {
    if (this.simple && this.limit) {
      warn(`<paginate-links for="${this.for}"> 'simple' and 'limit' props can't be used at the same time. In this case, 'simple' will take precedence, and 'limit' will be ignored.`, this.parent, 'warn');
    }
    if (this.simple && !this.simple.next) {
      warn(`<paginate-links for="${this.for}"> 'simple' prop doesn't contain 'next' value.`, this.parent);
    }
    if (this.simple && !this.simple.prev) {
      warn(`<paginate-links for="${this.for}"> 'simple' prop doesn't contain 'prev' value.`, this.parent);
    }
    if (this.stepLinks && !this.stepLinks.next) {
      warn(`<paginate-links for="${this.for}"> 'step-links' prop doesn't contain 'next' value.`, this.parent);
    }
    if (this.stepLinks && !this.stepLinks.prev) {
      warn(`<paginate-links for="${this.for}"> 'step-links' prop doesn't contain 'prev' value.`, this.parent);
    }
    this.$nextTick(() => {
      this.updateListOfPages();
    });
  },
  watch: {
    'state': {
      handler () {
        this.updateListOfPages();
      },
      deep: true
    },
    currentPage (toPage, fromPage) {
      this.$emit('change', toPage + 1, fromPage + 1);
    }
  },
  methods: {
    updateListOfPages () {
      this.target = getTargetPaginateComponent(this.parent.$children, this.for);
      if (!this.target) {
        if (this.async) return
        warn(`<paginate-links for="${this.for}"> can't be used without its companion <paginate name="${this.for}">`, this.parent);
        warn(`To fix that issue you may need to use :async="true" on <paginate-links> component to allow for asyncronous rendering`, this.parent, 'warn');
        return
      }
      this.numberOfPages = Math.ceil(this.target.list.length / this.target.per);
      this.listOfPages = getListOfPageNumbers(this.numberOfPages);
    }
  },
  render (h) {
    if (!this.target && this.async) return null

    let links = this.simple
      ? getSimpleLinks(this, h)
      : this.limit > 1
      ? getLimitedLinks(this, h)
      : getFullLinks(this, h);

    if (this.hideSinglePage && this.numberOfPages <= 1) {
      return null
    }

    const el = h('ul', {
      class: ['paginate-links', this.for]
    }, links);

    if (this.classes) {
      this.$nextTick(() => {
        addAdditionalClasses(el.elm, this.classes);
      });
    }
    return el
  }
});

function getFullLinks (vm, h) {
  const allLinks = vm.showStepLinks
    ? [vm.stepLinks.prev, ...vm.listOfPages, vm.stepLinks.next]
    : vm.listOfPages;
  return allLinks.map(link => {
    const data = {
      on: {
        click: (e) => {
          e.preventDefault();
          vm.currentPage = getTargetPageForLink(
            link,
            vm.limit,
            vm.currentPage,
            vm.listOfPages,
            vm.stepLinks
          );
        }
      }
    };
    const liClasses = getClassesForLink(
      link,
      vm.currentPage,
      vm.listOfPages.length - 1,
      vm.stepLinks
    );
    const linkText = link === vm.stepLinks.next || link === vm.stepLinks.prev
      ? link
      : link + 1; // it means it's a number
    return h('li', { class: liClasses }, [h('a', data, linkText)])
  })
}

function getLimitedLinks (vm, h) {
  let limitedLinks = new LimitedLinksGenerator(
    vm.listOfPages,
    vm.currentPage,
    vm.limit,
    vm.stepLinks
  ).generate();

  limitedLinks = vm.showStepLinks
    ? [vm.stepLinks.prev, ...limitedLinks, vm.stepLinks.next]
    : limitedLinks;

  const limitedLinksMetadata = getLimitedLinksMetadata(limitedLinks);

  return limitedLinks.map((link, index) => {
    const data = {
      on: {
        click: (e) => {
          e.preventDefault();
          vm.currentPage = getTargetPageForLink(
            link,
            vm.limit,
            vm.currentPage,
            vm.listOfPages,
            vm.stepLinks,
            limitedLinksMetadata[index]
          );
        }
      }
    };
    const liClasses = getClassesForLink(
      link,
      vm.currentPage,
      vm.listOfPages.length - 1,
      vm.stepLinks
    );
    // If the link is a number,
    // then incremented by 1 (since it's 0 based).
    // otherwise, do nothing (so, it's a symbol).
    const text = (link === parseInt(link, 10)) ? link + 1 : link;
    return h('li', { class: liClasses }, [h('a', data, text)])
  })
}

function getSimpleLinks (vm, h) {
  const lastPage = vm.listOfPages.length - 1;
  const prevData = {
    on: {
      click: (e) => {
        e.preventDefault();
        if (vm.currentPage > 0) vm.currentPage -= 1;
      }
    }
  };
  const nextData = {
    on: {
      click: (e) => {
        e.preventDefault();
        if (vm.currentPage < lastPage) vm.currentPage += 1;
      }
    }
  };
  const nextListData = { class: ['next', vm.currentPage >= lastPage ? 'disabled' : ''] };
  const prevListData = { class: ['prev', vm.currentPage <= 0 ? 'disabled' : ''] };
  const prevLink = h('li', prevListData, [h('a', prevData, vm.simple.prev)]);
  const nextLink = h('li', nextListData, [h('a', nextData, vm.simple.next)]);
  return [prevLink, nextLink]
}

function getTargetPaginateComponent (children, targetName) {
  return children
    .filter(child => (child.$vnode.componentOptions.tag === 'paginate'))
    .find(child => child.name === targetName)
}

function getListOfPageNumbers (numberOfPages) {
  // converts number of pages into an array
  // that contains each individual page number
  // For Example: 4 => [0, 1, 2, 3]
  return Array.apply(null, { length: numberOfPages })
    .map((val, index) => index)
}

function getClassesForLink(link, currentPage, lastPage, { prev, next }) {
  let liClass = [];
  if (link === prev) {
    liClass.push('left-arrow');
  } else if (link === next) {
    liClass.push('right-arrow');
  } else if (link === ELLIPSES) {
    liClass.push('ellipses');
  } else {
    liClass.push('number');
  }

  if (link === currentPage) {
    liClass.push('active');
  }

  if (link === prev && currentPage <= 0) {
    liClass.push('disabled');
  } else if (link === next && currentPage >= lastPage) {
    liClass.push('disabled');
  }
  return liClass
}

function getTargetPageForLink (link, limit, currentPage, listOfPages, { prev, next }, metaData = null) {
  let currentChunk = Math.floor(currentPage / limit);
  if (link === prev) {
    return (currentPage - 1) < 0 ? 0 : currentPage - 1
  } else if (link === next) {
    return (currentPage + 1 > listOfPages.length - 1)
      ? listOfPages.length - 1
      : currentPage + 1
  } else if (metaData && metaData === 'right-ellipses') {
    return (currentChunk + 1) * limit
  } else if (metaData && metaData === 'left-ellipses') {
    const chunkContent = listOfPages.slice(currentChunk * limit, currentChunk * limit + limit);
    const isLastPage = currentPage === listOfPages.length - 1;
    if (isLastPage && chunkContent.length === 1) {
      currentChunk--;
    }
    return (currentChunk - 1) * limit + limit - 1
  }
  // which is number
  return link
}

/**
 * Mainly used here to check whether the displayed
 * ellipses is for showing previous or next links
 */
function getLimitedLinksMetadata (limitedLinks) {
  return limitedLinks.map((link, index) => {
    if (link === ELLIPSES && limitedLinks[index - 1] === 0) {
      return 'left-ellipses'
    } else if (link === ELLIPSES && limitedLinks[index - 1] !== 0) {
      return 'right-ellipses'
    }
    return link
  })
}

function addAdditionalClasses (linksContainer, classes) {
  Object.keys(classes).forEach(selector => {
    if (selector === 'ul') {
      const selectorValue = classes['ul'];
      if (Array.isArray(selectorValue)) {
        selectorValue.forEach(c => linksContainer.classList.add(c));
      } else {
        linksContainer.classList.add(selectorValue);
      }
    }
    linksContainer.querySelectorAll(selector).forEach(node => {
      const selectorValue = classes[selector];
      if (Array.isArray(selectorValue)) {
        selectorValue.forEach(c => node.classList.add(c));
      } else {
        node.classList.add(selectorValue);
      }
    });
  });
}

var paginateDataGenerator = (listNames = []) => {
    return listNames.reduce((curr, listName) => {
        curr[listName] = {
            list: [],
            page: 0
        };
        return curr;
    }, {});
};

const vuePaginate = {
    install(app) {
        app.mixin({
            created() {
                if (typeof this.paginate !== 'undefined' && this.paginate instanceof Array) {
                    this.paginate = paginateDataGenerator(this.paginate);
                }
            },
            methods: {
                paginated(listName) {
                    if (this.paginate instanceof Array) {
                        // unreachable
                        return;
                    }
                    if (!this.paginate || !this.paginate[listName]) {
                        warn(`'${listName}' is not registered in 'paginate' array.`, this);
                        return;
                    }
                    return this.paginate[listName].list;
                }
            }
        });
        app.component('paginate', Paginate);
        app.component('paginate-links', PaginateLinks);
    }
};
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(vuePaginate);
}

export default vuePaginate;
