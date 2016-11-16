import Vue from 'vue/dist/vue'
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

  it('slices the list using `per` prop and stores the result in the paginate object', done => {
    Vue.nextTick(() => {
      expect(vm.paginate.langs.list.length).to.equal(2)
      expect(vm.paginate.langs.list).to.include.members(['JavaScript', 'PHP'])
      expect(vm.paginate.langs.list).to.not.include.members(['HTML', 'CSS'])
      done()
    })
  })

  it('can change pages', done => {
    // Note that page is 0-based
    vm.paginate.langs.page = 1
    Vue.nextTick(() => {
      expect(vm.paginate.langs.list).to.include.members(['HTML', 'CSS'])
      expect(vm.paginate.langs.list).to.not.include.members(['JavaScript', 'PHP'])
      done()
    })
  })

  it('refreshes the paginated list and start from first page when the full list is changed', done => {
    vm.paginate.langs.page = 1
    vm.langs = ['foo', 'bar', 'baz', 'quix']
    Vue.nextTick(() => {
      expect(vm.paginate.langs.list).to.include.members(['foo', 'bar'])
      expect(vm.paginate.langs.list).to.not.include.members(['JavaScript', 'PHP'])
      done()
    })

  })

  it('allows `per` prop to be dynamic', (done) => {
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

  it('uses UL as the default container tag', () => {
    expect(vm.$el.children[0].tagName).to.equal('UL')
  })

  it('can change container tag', (done) => {
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

  it('can set custom class', (done) => {
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
})
