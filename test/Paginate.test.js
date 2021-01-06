import { createLocalVue, mount } from '@vue/test-utils'
import VuePaginate from '../src'
import Paginate from '../src/components/Paginate'

const localVue = createLocalVue()
localVue.use(VuePaginate)

const LANGS = [
  'JavaScript', 'PHP', 'HTML', 'CSS',
  'Ruby', 'Python',
  'Erlang', 'Go'
]

const PaginateTest = {
  template: `
      <div>
        <paginate
          name="langs"
          :list="langs"
          :per="2"
        ></paginate>
      </div>`,
  data: () => ({
    langs: LANGS,
    paginate: { langs: { list: [], page: 0 } }
  }),
  components: { Paginate }
}

describe('Paginate.vue', () => {
  test('slices the list using `per` prop and stores the result in the paginate object', done => {
    const wrapper = mount(PaginateTest, { localVue })
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.paginate.langs.list.length).toBe(2)
      expect(wrapper.vm.paginate.langs.list).toEqual(expect.arrayContaining(['JavaScript', 'PHP']))
      expect(wrapper.vm.paginate.langs.list).not.toEqual(expect.arrayContaining(['HTML', 'CSS']))
      done()
    })
  })

  test('can change pages', done => {
    const wrapper = mount(PaginateTest, { localVue })
    // Note that page is 0-based
    wrapper.vm.paginate.langs.page = 1
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.paginate.langs.list).toEqual(expect.arrayContaining(['HTML', 'CSS']))
      expect(wrapper.vm.paginate.langs.list).not.toEqual(expect.arrayContaining(['JavaScript', 'PHP']))
      done()
    })
  })

  test('refreshes the paginated list and make sure the current page is not out of scope when the full list is changed', done => {
    const wrapper = mount(PaginateTest, { localVue })
    wrapper.vm.paginate.langs.page = 1
    wrapper.vm.langs = ['foo', 'bar', 'baz', 'quix']
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.paginate.langs.list).toEqual(expect.arrayContaining(['baz', 'quix']))
      expect(wrapper.vm.paginate.langs.list).not.toEqual(expect.arrayContaining(['JavaScript', 'PHP']))
      done()
    })
  })

  test('allows `per` prop to be dynamic', (done) => {
    const wrapper = mount({
      template: `
        <div>
          <paginate
            name="langs"
            :list="langs"
            :per="dynamicPer"
            tag="div"
          ></paginate>
        </div>`,
      data: () => ({
        langs: LANGS,
        paginate: { langs: { list: [], page: 0 } },
        dynamicPer: 3
      }),
      components: { Paginate }
    }, { localVue })

    expect(wrapper.vm.paginate.langs.list.length).toBe(3)
    wrapper.vm.dynamicPer = 4
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.paginate.langs.list.length).toBe(4)
      expect(wrapper.vm.paginate.langs.page).toBe(0)
      done()
    })
  })

  test('uses UL as the default container tag', () => {
    const wrapper = mount(PaginateTest, { localVue })
    expect(wrapper.vm.$el.children[0].tagName).toBe('UL')
  })

  test('can change container tag', (done) => {
    const wrapper = mount({
      template: `
        <div>
          <paginate
            name="langs"
            :list="langs"
            :per="2"
            tag="div"
          ></paginate>
        </div>`,
      data: () => ({
        langs: LANGS,
        paginate: { langs: { list: [], page: 0 } }
      }),
      components: { Paginate }
    }, { localVue })

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$el.children[0].tagName).toBe('DIV')
      done()
    })
  })

  test('can set custom class', (done) => {
    const wrapper = mount({
      template: `
        <div>
          <paginate
            name="langs"
            :list="langs"
            :per="2"
            class="test-paginate"
          ></paginate>
        </div>`,
      data: () => ({
        langs: LANGS,
        paginate: { langs: { list: [], page: 0 } }
      }),
      components: { Paginate }
    }, { localVue })
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.$el.children[0].className).toBe('test-paginate')
      done()
    })
  })

  test('goes to a specific page programmatically', (done) => {
    const wrapper = mount({
      template: `
        <div>
          <paginate ref="paginate"
            name="langs"
            :list="langs"
            :per="2"
            class="test-paginate"
          ></paginate>
        </div>`,
      data: () => ({
        langs: LANGS,
        paginate: { langs: { list: [], page: 0 } }
      }),
      components: { Paginate }
    }, { localVue })
    const paginator = wrapper.vm.$refs.paginate
    expect(paginator.currentPage).toBe(0)
    paginator.goToPage(3)
    wrapper.vm.$nextTick(() => {
      expect(paginator.currentPage).toBe(2)
      done()
    })
  })

  test('has page items count descripiton', (done) => {
    const wrapper = mount({
      template: `
        <div>
          <paginate ref="paginate"
            name="langs"
            :list="langs"
            :per="2"
            class="test-paginate"
          ></paginate>
        </div>`,
      data: () => ({
        langs: LANGS,
        paginate: { langs: { list: [], page: 0 } }
      }),
      components: { Paginate }
    }, { localVue })
    const paginator = wrapper.vm.$refs.paginate
    wrapper.vm.$nextTick(() => {
      expect(paginator.pageItemsCount).toBe('1-2 of 8')
      wrapper.vm.paginate.langs.page = 1
      wrapper.vm.$nextTick(() => {
        expect(paginator.pageItemsCount).toBe('3-4 of 8')
        done()
      })
    })
  })
})
