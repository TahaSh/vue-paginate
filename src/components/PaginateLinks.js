import LimitedLinksGenerator from '../util/LimitedLinksGenerator';
import { LEFT_ARROW, RIGHT_ARROW, ELLIPSES } from '../config/linkTypes';
import { warn } from '../util/debug';

export default {
  name: 'paginate-links',
  props: {
    for: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      default: 0,
    },
    simple: {
      type: Boolean,
      default: false,
    },
    showStepLinks: {
      type: Boolean,
    },
    hideSinglePage: {
      type: Boolean,
    },
    classes: {
      type: Object,
      default: null,
    },
    async: {
      type: Boolean,
      default: false,
    },
    container: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      listOfPages: [],
      numberOfPages: 0,
      target: null,
    };
  },
  computed: {
    parent() {
      return this.container ? this.container.el : this.$parent;
    },
    state() {
      return this.container
        ? this.container.state
        : this.$parent.paginate[this.for];
    },
    currentPage: {
      get() {
        if (this.state) {
          return this.state.page;
        }
      },
      set(page) {
        this.state.page = page;
      },
    },
  },
  mounted() {
    if (this.simple && this.limit) {
      warn(
        `<paginate-links for="${
          this.for
        }"> 'simple' and 'limit' props can't be used at the same time. In this case, 'simple' will take precedence, and 'limit' will be ignored.`,
        this.parent,
        'warn'
      );
    }
    this.$nextTick(() => {
      this.updateListOfPages();
    });
  },
  watch: {
    state: {
      handler() {
        this.updateListOfPages();
      },
      deep: true,
    },
    currentPage(toPage, fromPage) {
      this.$emit('change', toPage + 1, fromPage + 1);
    },
  },
  methods: {
    updateListOfPages() {
      this.target = getTargetPaginateComponent(this.parent.$children, this.for);
      if (!this.target) {
        if (this.async) return;
        warn(
          `<paginate-links for="${
            this.for
          }"> can't be used without its companion <paginate name="${
            this.for
          }">`,
          this.parent
        );
        warn(
          `To fix that issue you may need to use :async="true" on <paginate-links> component to allow for asyncronous rendering`,
          this.parent,
          'warn'
        );
        return;
      }
      this.numberOfPages = Math.ceil(this.target.list.length / this.target.per);
      this.listOfPages = getListOfPageNumbers(this.numberOfPages);
    },
  },
  render(h) {
    if (!this.target && this.async) return null;

    const links = this.simple
      ? getSimpleLinks(this, h)
      : this.limit > 1
        ? getLimitedLinks(this, h)
        : getFullLinks(this, h);

    if (this.hideSinglePage && this.numberOfPages <= 1) {
      return null;
    }

    const el = h(
      'ul',
      {
        class: ['paginate-links', this.for],
      },
      links
    );

    if (this.classes) {
      this.$nextTick(() => {
        addAdditionalClasses(el.elm, this.classes);
      });
    }
    return el;
  },
};

function getFullLinks(vm, h) {
  const stepLinks = {
    prev: vm.$slots.prev ? vm.$slots.prev : LEFT_ARROW,
    next: vm.$slots.next ? vm.$slots.next : RIGHT_ARROW,
  };

  const allLinks = vm.showStepLinks
    ? [stepLinks.prev, ...vm.listOfPages, stepLinks.next]
    : vm.listOfPages;
  return allLinks.map(link => {
    const data = {
      on: {
        click: e => {
          e.preventDefault();
          vm.currentPage = getTargetPageForLink(
            link,
            vm.limit,
            vm.currentPage,
            vm.listOfPages,
            stepLinks
          );
        },
      },
    };
    const liClasses = getClassesForLink(
      link,
      vm.currentPage,
      vm.listOfPages.length - 1,
      stepLinks
    );
    const linkText =
      link === stepLinks.next || link === stepLinks.prev ? link : link + 1; // it means it's a number
    return h('li', { class: liClasses }, [h('a', data, linkText)]);
  });
}

function getLimitedLinks(vm, h) {
  const stepLinks = {
    prev: vm.$slots.prev ? vm.$slots.prev : LEFT_ARROW,
    next: vm.$slots.next ? vm.$slots.next : RIGHT_ARROW,
  };
  let limitedLinks = new LimitedLinksGenerator(
    vm.listOfPages,
    vm.currentPage,
    vm.limit,
    stepLinks
  ).generate();

  limitedLinks = vm.showStepLinks
    ? [stepLinks.prev, ...limitedLinks, stepLinks.next]
    : limitedLinks;

  const limitedLinksMetadata = getLimitedLinksMetadata(limitedLinks);

  return limitedLinks.map((link, index) => {
    const data = {
      on: {
        click: e => {
          e.preventDefault();
          vm.currentPage = getTargetPageForLink(
            link,
            vm.limit,
            vm.currentPage,
            vm.listOfPages,
            stepLinks,
            limitedLinksMetadata[index]
          );
        },
      },
    };
    const liClasses = getClassesForLink(
      link,
      vm.currentPage,
      vm.listOfPages.length - 1,
      stepLinks
    );
    // If the link is a number,
    // then incremented by 1 (since it's 0 based).
    // otherwise, do nothing (so, it's a symbol).
    const text = link === parseInt(link, 10) ? link + 1 : link;
    return h('li', { class: liClasses }, [h('a', data, text)]);
  });
}

function getSimpleLinks(vm, h) {
  const lastPage = vm.listOfPages.length - 1;
  const prevData = {
    on: {
      click: e => {
        e.preventDefault();
        if (vm.currentPage > 0) vm.currentPage -= 1;
      },
    },
  };
  const nextData = {
    on: {
      click: e => {
        e.preventDefault();
        if (vm.currentPage < lastPage) vm.currentPage += 1;
      },
    },
  };
  const nextListData = {
    class: ['next', vm.currentPage >= lastPage ? 'disabled' : ''],
  };
  const prevListData = {
    class: ['prev', vm.currentPage <= 0 ? 'disabled' : ''],
  };

  const prevLink = h('li', prevListData, [
    h('a', prevData, [vm.$slots.prev ? vm.$slots.prev : LEFT_ARROW]),
  ]);
  const nextLink = h('li', nextListData, [
    h('a', nextData, [vm.$slots.next ? vm.$slots.next : RIGHT_ARROW]),
  ]);
  return [prevLink, nextLink];
}

function getTargetPaginateComponent(children, targetName) {
  return children
    .filter(child => child.$vnode.componentOptions.tag === 'paginate')
    .find(child => child.name === targetName);
}

function getListOfPageNumbers(numberOfPages) {
  // converts number of pages into an array
  // that contains each individual page number
  // For Example: 4 => [0, 1, 2, 3]
  return Array(...{ length: numberOfPages }).map((val, index) => index);
}

function getClassesForLink(link, currentPage, lastPage, { prev, next }) {
  const liClass = [];
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
  return liClass;
}

function getTargetPageForLink(
  link,
  limit,
  currentPage,
  listOfPages,
  { prev, next },
  metaData = null
) {
  let currentChunk = Math.floor(currentPage / limit);
  if (link === prev) {
    return currentPage - 1 < 0 ? 0 : currentPage - 1;
  } else if (link === next) {
    return currentPage + 1 > listOfPages.length - 1
      ? listOfPages.length - 1
      : currentPage + 1;
  } else if (metaData && metaData === 'right-ellipses') {
    return (currentChunk + 1) * limit;
  } else if (metaData && metaData === 'left-ellipses') {
    const chunkContent = listOfPages.slice(
      currentChunk * limit,
      currentChunk * limit + limit
    );
    const isLastPage = currentPage === listOfPages.length - 1;
    if (isLastPage && chunkContent.length === 1) {
      currentChunk--;
    }
    return (currentChunk - 1) * limit + limit - 1;
  }
  // which is number
  return link;
}

/**
 * Mainly used here to check whether the displayed
 * ellipses is for showing previous or next links
 */
function getLimitedLinksMetadata(limitedLinks) {
  return limitedLinks.map((link, index) => {
    if (link === ELLIPSES && limitedLinks[index - 1] === 0) {
      return 'left-ellipses';
    } else if (link === ELLIPSES && limitedLinks[index - 1] !== 0) {
      return 'right-ellipses';
    }
    return link;
  });
}

function addAdditionalClasses(linksContainer, classes) {
  Object.keys(classes).forEach(selector => {
    if (selector === 'ul') {
      const selectorValue = classes.ul;
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
