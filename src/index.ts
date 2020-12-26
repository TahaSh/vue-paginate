import Vue, { VueConstructor } from 'vue'
import Paginate from './components/Paginate'
import PaginateLinks from './components/PaginateLinks'
import paginateDataGenerator, { PaginateData } from './util/paginateDataGenerator'
import { warn } from './util/debug'

declare module 'vue/types/vue' {
  interface Vue {
    paginate?: string[] | Record<string, PaginateData>
  }
}

const vuePaginate = {
  install(app: VueConstructor) {
    app.mixin({
      created(this: Vue) {
        if (typeof this.paginate !== 'undefined' && this.paginate instanceof Array) {
          this.paginate = paginateDataGenerator(this.paginate)
        }
      },
      methods: {
        paginated(listName: string) {
          if (this.paginate instanceof Array) {
            // unreachable
            return
          }

          if (!this.paginate || !this.paginate[listName]) {
            warn(`'${listName}' is not registered in 'paginate' array.`, this)
            return
          }
          return this.paginate[listName].list
        }
      }
    })
    app.component('paginate', Paginate)
    app.component('paginate-links', PaginateLinks)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vuePaginate)
}

export default vuePaginate
