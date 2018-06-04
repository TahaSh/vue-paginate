import { warn } from '../util/debug'

export default {
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
      validator (value) {
        return value > 0
      }
    },
    tag: {
      type: String,
      default: 'ul'
    },
    container: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      initialListSize: this.list.length
    }
  },
  computed: {
    parent () {
      return this.container ? this.container : this.$parent
    },
    currentPage: {
      get () {
        if (this.parent.paginate[this.name]) {
          return this.parent.paginate[this.name].page
        }
      },
      set (page) {
        this.parent.paginate[this.name].page = page
      }
    },
    pageItemsCount () {
      const numOfItems = this.list.length
      const first = this.currentPage * this.per + 1
      const last = Math.min((this.currentPage * this.per) + this.per, numOfItems)
      return `${first}-${last} of ${numOfItems}`
    },

    lastPage () {
      return Math.ceil(this.list.length / this.per)
    }
  },
  mounted () {
    if (this.per <= 0) {
      warn(`<paginate name="${this.name}"> 'per' prop can't be 0 or less.`, this.parent)
    }
    if (!this.parent.paginate[this.name]) {
      warn(`'${this.name}' is not registered in 'paginate' array.`, this.parent)
      return
    }
    this.paginateList()
  },
  watch: {
    currentPage () {
      this.paginateList()
    },
    list () {
      if (this.currentPage >= this.lastPage && this.lastPage > 0) {
        this.currentPage = this.lastPage - 1
      } else {
        this.currentPage = 0
      }
      this.paginateList()
    },
    per () {
      this.currentPage = 0
      this.paginateList()
    }
  },
  methods: {
    paginateList () {
      const index = this.currentPage * this.per
      const paginatedList = this.list.slice(index, index + this.per)
      this.parent.paginate[this.name].list = paginatedList
    },
    goToPage (page) {
      const lastPage = Math.ceil(this.list.length / this.per)
      if (page > lastPage) {
        warn(`You cannot go to page ${page}. The last page is ${lastPage}.`, this.parent)
        return
      }
      this.currentPage = page - 1
    }
  },
  render (h) {
    return h(this.tag, {}, this.$slots.default)
  }
}
