import Vue from 'vue'
import Paginate from '../src/components/Paginate'

const LANGS = [
  'JavaScript', 'PHP', 'HTML', 'CSS',
  'Ruby', 'Python',
  'Erlang', 'Go'
]

describe('Paginate.vue', () => {
  let vm
  
  beforeEach(() => {
    vm = new Vue({
      template: `
      <div>
        <paginate
          name="langs"
          :list="langs"
          :per="2"
        ></paginate>
      </div>`,
      data: {
        langs: LANGS,
        paginate: {langs: { list: [], page: 0 }}
      },
      components: { Paginate }
    }).$mount()
  })

  test('slices the list using `per` prop and stores the result in the paginate object', done => {
    Vue.nextTick(() => {
      expect(vm.paginate.langs.list.length).to.equal(2)
      expect(vm.paginate.langs.list).to.include.members(['JavaScript', 'PHP'])
      expect(vm.paginate.langs.list).to.not.include.members(['HTML', 'CSS'])
      done()
    })
  })

  test('can change pages', done => {
    // Note that page is 0-based
    vm.paginate.langs.page = 1
    Vue.nextTick(() => {
      expect(vm.paginate.langs.list).to.include.members(['HTML', 'CSS'])
      expect(vm.paginate.langs.list).to.not.include.members(['JavaScript', 'PHP'])
      done()
    })
  })

  test('refreshes the paginated list and make sure the current page is not out of scope when the full list is changed', done => {
    vm.paginate.langs.page = 1
    vm.langs = ['foo', 'bar', 'baz', 'quix']
    Vue.nextTick(() => {
      expect(vm.paginate.langs.list).to.include.members(['baz', 'quix'])
      expect(vm.paginate.langs.list).to.not.include.members(['JavaScript', 'PHP'])
      done()
    })
  })

  test('allows `per` prop to be dynamic', (done) => {
    vm = new Vue({
      template: `
      <div>
        <paginate
          name="langs"
          :list="langs"
          :per="dynamicPer"
          tag="div"
        ></paginate>
      </div>`,
      data: {
        langs: LANGS,
        paginate: {langs: { list: [], page: 0 }},
        dynamicPer: 3
      },
      components: { Paginate }
    }).$mount()
    expect(vm.paginate.langs.list.length).to.equal(3)
    vm.dynamicPer = 4
    Vue.nextTick(() => {
      expect(vm.paginate.langs.list.length).to.equal(4)
      expect(vm.paginate.langs.page).to.equal(0)
      done()
    })
  })

  test('uses UL as the default container tag', () => {
    expect(vm.$el.children[0].tagName).to.equal('UL')
  })

  test('can change container tag', (done) => {
    vm = new Vue({
      template: `
      <div>
        <paginate
          name="langs"
          :list="langs"
          :per="2"
          tag="div"
        ></paginate>
      </div>`,
      data: {
        langs: LANGS,
        paginate: {langs: { list: [], page: 0 }}
      },
      components: { Paginate }
    }).$mount()
    Vue.nextTick(() => {
      expect(vm.$el.children[0].tagName).to.equal('DIV')
      done()
    })
  })

  test('can set custom class', (done) => {
    vm = new Vue({
      template: `
      <div>
        <paginate
          name="langs"
          :list="langs"
          :per="2"
          class="test-paginate"
        ></paginate>
      </div>`,
      data: {
        langs: LANGS,
        paginate: {langs: { list: [], page: 0 }}
      },
      components: { Paginate }
    }).$mount()
    Vue.nextTick(() => {
      expect(vm.$el.children[0].className).to.equal('test-paginate')
      done()
    })
  })

  test('goes to a specific page programmatically', (done) => {
    vm = new Vue({
      template: `
      <div>
        <paginate ref="paginate"
          name="langs"
          :list="langs"
          :per="2"
          class="test-paginate"
        ></paginate>
      </div>`,
      data: {
        langs: LANGS,
        paginate: {langs: { list: [], page: 0 }}
      },
      components: { Paginate }
    }).$mount()
    const paginator = vm.$refs.paginate
    expect(paginator.currentPage).to.equal(0)
    paginator.goToPage(3)
    Vue.nextTick(() => {
      expect(paginator.currentPage).to.equal(2)
      done()
    })
  })

  test('has page items count descripiton', (done) => {
    vm = new Vue({
      template: `
      <div>
        <paginate ref="paginate"
          name="langs"
          :list="langs"
          :per="2"
          class="test-paginate"
        ></paginate>
      </div>`,
      data: {
        langs: LANGS,
        paginate: {langs: { list: [], page: 0 }}
      },
      components: { Paginate }
    }).$mount()
    const paginator = vm.$refs.paginate
    Vue.nextTick(() => {
      expect(paginator.pageItemsCount).to.equal('1-2 of 8')
      vm.paginate.langs.page = 1
      Vue.nextTick(() => {
        expect(paginator.pageItemsCount).to.equal('3-4 of 8')
        done()
      })
    })
  })
})
