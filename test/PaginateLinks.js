import Vue from 'vue/dist/vue'
import PaginateLinks from '../src/components/PaginateLinks'
import Paginate from '../src/components/Paginate'

const LANGS = [
  'JavaScript', 'PHP',
  'HTML', 'CSS',
  'Ruby', 'Python',
  'Erlang', 'Go'
]

describe('PaginateLinks.vue', () => {
  let vm

  it('renders a full list of links', (done) => {
    vm = new Vue({
      template: `
        <div>
          <paginate
            name="langs"
            :list="langs"
            :per="2"
          ></paginate>
          <paginate-links for="langs"></paginate-links>
        </div>`,
      data: {
        langs: LANGS,
        paginate: {langs: { list: [], page: 0 }}
      },
      components: { Paginate, PaginateLinks }
    }).$mount()
    Vue.nextTick(() => {
      expect(vm.$el.querySelector('.paginate-links').innerHTML).to.equal([
        '<li class="active"><a>1</a></li>',
        '<li><a>2</a></li>',
        '<li><a>3</a></li>',
        '<li><a>4</a></li>'
      ].join(''))
      done()
    })
  })

  describe('simple links', () => {
    beforeEach(() => {
      vm = new Vue({
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
        data: {
          langs: LANGS,
          paginate: {langs: { list: [], page: 0 }}
        },
        components: { Paginate, PaginateLinks }
      }).$mount()
    })
    
    it('adds `disabled` class to previous link on first page', (done) => {
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).to.equal([
          '<li class="prev disabled"><a>Previous</a></li>',
          '<li class="next"><a>Next</a></li>'
        ].join(''))
        done()
      })
    })
    
    it('doesn\'t add `disabled` class when we are not in first or final page', (done) => {
      vm.paginate.langs.page++
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).to.equal([
          '<li class="prev"><a>Previous</a></li>',
          '<li class="next"><a>Next</a></li>'
        ].join(''))
        done()
      })
    })

    it('adds `disabled` class to next link on final page', (done) => {
      vm.paginate.langs.page = 3
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).to.equal([
          '<li class="prev"><a>Previous</a></li>',
          '<li class="next disabled"><a>Next</a></li>'
        ].join(''))
        done()
      })
    })
  })

  describe('limited links', () => {
    beforeEach(() => {
      vm = new Vue({
        template:
          `<div>
            <paginate name="langs" :list="langs" :per="1"></paginate>
            <paginate-links for="langs" :limit="2"></paginate-links>
          </div>`,
        data: {
          langs: LANGS,
          paginate: {langs: { list: [], page: 0 }}
        },
        components: { Paginate, PaginateLinks }
      }).$mount()
    })

    it('shows correct links with classes', (done) => {
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).to.equal([
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

    it('keeps displayed links the same if the targeted page is within current limited scope', (done) => {
      vm.paginate.langs.page++
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).to.equal([
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

    it('changes the displayed links when the targeted page is out of current limited scope', (done) => {
      vm.paginate.langs.page = 3
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).to.equal([
          '<li class="left-arrow"><a>«</a></li>',
          '<li class="number"><a>1</a></li>',
          '<li class="ellipses"><a>…</a></li>',
          '<li class="number"><a>3</a></li>',
          '<li class="number active"><a>4</a></li>',
          '<li class="ellipses"><a>…</a></li>',
          '<li class="number"><a>8</a></li>',
          '<li class="right-arrow"><a>»</a></li>'
        ].join(''))
        done()
      })
    })

    it('displays links properly when changing to the last page', (done) => {
      vm.paginate.langs.page = 7
      Vue.nextTick(() => {
        expect(vm.$el.querySelector('.paginate-links').innerHTML).to.equal([
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

  })

})
