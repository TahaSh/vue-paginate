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
    class: {
      type: String
    }
  },
  data () {
    return {}
  },
  computed: {
    currentPage: {
      get () {
        if (this.$parent.paginate[this.name]) {
          return this.$parent.paginate[this.name].page
        }
      },
      set (page) {
        this.$parent.paginate[this.name].page = page
      }
    }
  },
  mounted () {
    if (this.per <= 0) {
      warn(`<paginate name="${this.name}"> 'per' prop can't be 0 or less.`, this.$parent)
    }
    if (!this.$parent.paginate[this.name]) {
      warn(`'${this.name}' is not registered in 'paginate' array.`, this.$parent)
      return
    }
    this.paginateList()
  },
  watch: {
    currentPage () {
      this.paginateList()
    },
    list () {
      // On list change, refresh the paginated list
      this.currentPage = 0
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
      this.$parent.paginate[this.name].list = paginatedList
    }
  },
  render (h) {
    const className = this.class ? this.class : ''
    return h(this.tag, { class: className }, this.$slots.default)
  }
}