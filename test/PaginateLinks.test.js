import { createLocalVue, mount } from '@vue/test-utils'
import Vue from 'vue'
import VuePaginate from '../src'
import PaginateLinks from '../src/components/PaginateLinks'
import Paginate from '../src/components/Paginate'

const localVue = createLocalVue()
localVue.use(VuePaginate)

const LANGS = [
  'JavaScript', 'PHP',
  'HTML', 'CSS',
  'Ruby', 'Python',
  'Erlang', 'Go'
]

describe('PaginateLinks.vue', () => {
  describe('full links', () => {
    test('renders a full list of links', (done) => {
      const wrapper = mount({
        template: `
          <div>
            <paginate
              name="langs"
              :list="langs"
              :per="2"
            ></paginate>
            <paginate-links for="langs"></paginate-links>
          </div>`,
        data: () => ({
          langs: LANGS,
          paginate: { langs: { list: [], page: 0 } }
        }),
        components: { Paginate, PaginateLinks }
      }, { localVue })
      const vm = wrapper.vm

      vm.$nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
          '<li class="number active"><a>1</a></li>',
          '<li class="number"><a>2</a></li>',
          '<li class="number"><a>3</a></li>',
          '<li class="number"><a>4</a></li>'
        ].join(''))
        done()
      })
    })

    test('can show step links for full links', (done) => {
      const wrapper = mount({
        template: `
              <div>
                <paginate
                  name="langs"
                  :list="langs"
                  :per="2"
                ></paginate>
                <paginate-links for="langs"
                  :show-step-links="true"
                  :step-links="{
                    prev: 'P',
                    next: 'N'
                  }"
                ></paginate-links>
              </div>`,
        data: () => ({
          langs: LANGS,
          paginate: { langs: { list: [], page: 0 } }
        }),
        components: { Paginate, PaginateLinks }
      }, { localVue })
      const vm = wrapper.vm

      vm.$nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
          '<li class="left-arrow disabled"><a>P</a></li>',
          '<li class="number active"><a>1</a></li>',
          '<li class="number"><a>2</a></li>',
          '<li class="number"><a>3</a></li>',
          '<li class="number"><a>4</a></li>',
          '<li class="right-arrow"><a>N</a></li>'
        ].join(''))
        done()
      })
    })
  })

  describe('simple links', () => {
    const TestComponent = {
      template: `
            <div>
              <paginate
                name="langs"
                :list="langs"
                :per="2"
              ></paginate>
              <paginate-links
                for="langs"
                :simple="{
                  prev: 'Previous',
                  next: 'Next'
                }">
              </paginate-links>
            </div>`,
      data: () => ({
        langs: LANGS,
        paginate: { langs: { list: [], page: 0 } }
      }),
      components: { Paginate, PaginateLinks }
    }

    test('adds `disabled` class to previous link on first page', (done) => {
      const wrapper = mount(TestComponent, { localVue })
      const vm = wrapper.vm
      vm.$nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
          '<li class="prev disabled"><a>Previous</a></li>',
          '<li class="next"><a>Next</a></li>'
        ].join(''))
        done()
      })
    })

    test('doesn\'t add `disabled` class when we are not in first or final page', (done) => {
      const wrapper = mount(TestComponent, { localVue })
      const vm = wrapper.vm
      vm.paginate.langs.page++
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
          '<li class="prev"><a>Previous</a></li>',
          '<li class="next"><a>Next</a></li>'
        ].join(''))
        done()
      })
    })

    test('adds `disabled` class to next link on final page', (done) => {
      const wrapper = mount(TestComponent, { localVue })
      const vm = wrapper.vm
      vm.paginate.langs.page = 3
      vm.$nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
          '<li class="prev"><a>Previous</a></li>',
          '<li class="next disabled"><a>Next</a></li>'
        ].join(''))
        done()
      })
    })
  })

  describe('limited links', () => {
    const TestComponent = {
      template:
        `<div>
             <paginate name="langs" :list="langs" :per="1"></paginate>
             <paginate-links for="langs" :limit="2"></paginate-links>
           </div>`,
      data: () => ({
        langs: LANGS,
        paginate: { langs: { list: [], page: 0 } }
      }),
      components: { Paginate, PaginateLinks }
    }

    test('shows correct links with classes', (done) => {
      const wrapper = mount(TestComponent, { localVue })
      const vm = wrapper.vm
      vm.$nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
          '<li class="number active"><a>1</a></li>',
          '<li class="number"><a>2</a></li>',
          '<li class="ellipses"><a>…</a></li>',
          '<li class="number"><a>8</a></li>',
        ].join(''))
        done()
      })
    })

    test('keeps displayed links the same if the targeted page is within current limited scope', (done) => {
      const wrapper = mount(TestComponent, { localVue })
      const vm = wrapper.vm
      vm.paginate.langs.page++
      vm.$nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
          '<li class="number"><a>1</a></li>',
          '<li class="number active"><a>2</a></li>',
          '<li class="ellipses"><a>…</a></li>',
          '<li class="number"><a>8</a></li>'
        ].join(''))
        done()
      })
    })

    test('changes the displayed links when the targeted page is out of current limited scope', (done) => {
      const wrapper = mount(TestComponent, { localVue })
      const vm = wrapper.vm
      vm.paginate.langs.page = 3
      vm.$nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
          '<li class="number"><a>1</a></li>',
          '<li class="ellipses"><a>…</a></li>',
          '<li class="number"><a>3</a></li>',
          '<li class="number active"><a>4</a></li>',
          '<li class="ellipses"><a>…</a></li>',
          '<li class="number"><a>8</a></li>'
        ].join(''))
        done()
      })
    })

    test('displays links properly when changing to the last page', (done) => {
      const wrapper = mount(TestComponent, { localVue })
      const vm = wrapper.vm
      vm.paginate.langs.page = 7
      vm.$nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
          '<li class="number"><a>1</a></li>',
          '<li class="ellipses"><a>…</a></li>',
          '<li class="number"><a>7</a></li>',
          '<li class="number active"><a>8</a></li>'
        ].join(''))
        done()
      })
    })

    describe('step links for limited links', () => {
      const TestComponent = {
        template:
          `<div>
               <paginate name="langs" :list="langs" :per="1"></paginate>
               <paginate-links for="langs"
                 :show-step-links="true"
                 :limit="2"
               ></paginate-links>
             </div>`,
        data: () => ({
          langs: LANGS,
          paginate: { langs: { list: [], page: 0 } }
        }),
        components: { Paginate, PaginateLinks }
      }

      test('can show step links for limited links', (done) => {
        const wrapper = mount(TestComponent, { localVue })
        const vm = wrapper.vm
        vm.$nextTick(() => {
          expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
            '<li class="left-arrow disabled"><a>«</a></li>',
            '<li class="number active"><a>1</a></li>',
            '<li class="number"><a>2</a></li>',
            '<li class="ellipses"><a>…</a></li>',
            '<li class="number"><a>8</a></li>',
            '<li class="right-arrow"><a>»</a></li>'
          ].join(''))
          done()
        })
      })

      test('removes disabled class from left arrow if not on first page', (done) => {
        const wrapper = mount(TestComponent, { localVue })
        const vm = wrapper.vm
        vm.paginate.langs.page++
        vm.$nextTick(() => {
          expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
            '<li class="left-arrow"><a>«</a></li>',
            '<li class="number"><a>1</a></li>',
            '<li class="number active"><a>2</a></li>',
            '<li class="ellipses"><a>…</a></li>',
            '<li class="number"><a>8</a></li>',
            '<li class="right-arrow"><a>»</a></li>'
          ].join(''))
          done()
        })
      })

      test('makes right arrow disabled if it is on last page', (done) => {
        const wrapper = mount(TestComponent, { localVue })
        const vm = wrapper.vm
        vm.paginate.langs.page = 7
        vm.$nextTick(() => {
          expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
            '<li class="left-arrow"><a>«</a></li>',
            '<li class="number"><a>1</a></li>',
            '<li class="ellipses"><a>…</a></li>',
            '<li class="number"><a>7</a></li>',
            '<li class="number active"><a>8</a></li>',
            '<li class="right-arrow disabled"><a>»</a></li>'
          ].join(''))
          done()
        })
      })

      test('customizes the step links', (done) => {
        const wrapper = mount({
          template:
            `<div>
               <paginate name="langs" :list="langs" :per="1"></paginate>
               <paginate-links for="langs"
                 :limit="2"
                 :show-step-links="true"
                 :step-links="{
                   next: 'N',
                   prev: 'P'
                 }"
               ></paginate-links>
             </div>`,
          data: () => ({
            langs: LANGS,
            paginate: { langs: { list: [], page: 0 } }
          }),
          components: { Paginate, PaginateLinks }
        }, { localVue })
        const vm = wrapper.vm

        vm.$nextTick(() => {
          expect(vm.$el.querySelector('.paginate-links').innerHTML).toBe([
            '<li class="left-arrow disabled"><a>P</a></li>',
            '<li class="number active"><a>1</a></li>',
            '<li class="number"><a>2</a></li>',
            '<li class="ellipses"><a>…</a></li>',
            '<li class="number"><a>8</a></li>',
            '<li class="right-arrow"><a>N</a></li>'
          ].join(''))
          done()
        })
      })

    })
  })

  describe('all types', () => {
    test('can be hidden if it contains a single page', (done) => {
      const wrapper = mount({
        template:
          `<div>
             <paginate name="langs" :list="langs" :per="8"></paginate>
             <paginate-links for="langs" :hide-single-page="true"></paginate-links>
           </div>`,
        data: () => ({
          langs: LANGS,
          paginate: { langs: { list: [], page: 0 } }
        }),
        components: { Paginate, PaginateLinks }
      }, { localVue })
      const vm = wrapper.vm

      vm.$nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links')).toBeNull()
        done()
      })
    })

    test('should not be hidden if it contains a single page and hide-single-page=false', (done) => {
      const wrapper = mount({
        template:
          `<div>
             <paginate name="langs" :list="langs" :per="8"></paginate>
             <paginate-links for="langs" :hide-single-page="false"></paginate-links>
           </div>`,
        data: () => ({
          langs: LANGS,
          paginate: { langs: { list: [], page: 0 } }
        }),
        components: { Paginate, PaginateLinks }
      }, { localVue })
      const vm = wrapper.vm

      vm.$nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links')).not.toBeNull()
        done()
      })
    })
  })
})
