<template>
  <div id="app">
    <h1>Vue-Paginate v3.0</h1>
    <paginate
      ref="paginator"
      :list="items"
      name="items"
      class="paginate-list"
    >
      <li
        v-for="(item, key) in paginated('items')"
        :key="key"
      >
        {{ item }}
      </li>
    </paginate>
    <paginate-links
      :show-step-links="true"
      for="items"
    >
      <template slot="prev">&larr;</template>
      <template slot="next">&rarr;</template>
    </paginate-links>
    <paginate-links
      :show-step-links="true"
      :limit="2"
      for="items"
    >
      <template slot="prev">Previous</template>
      <template slot="next">Next</template>
    </paginate-links>
    <paginate-links
      :simple="true"
      for="items"
    >
      <template slot="prev">
        <svg
          width="20px"
          height="15px"
          viewBox="0 0 20 20"
          xml:space="preserve"
        >
          <polyline
            fill="none"
            stroke="#42b983"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            points="17,3 3,10 17,17"
          />
        </svg>
      </template>
      <template slot="next">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="20px"
          height="15px"
          viewBox="0 0 20 20"
          xml:space="preserve"
        >
          <polyline
            fill="none"
            stroke="#42b983"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            points="3,3 17,10 3,17"
          />
        </svg>

      </template>
    </paginate-links>
    <span v-if="$refs.paginator">
      Viewing {{ $refs.paginator.pageItemsCount }} results
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        'Item One',
        'Item Two',
        'Item Three',
        'Item Four',
        'Item Five',
        'Item Six',
        'Item Seven',
        'Item Eight',
        'Item Nine',
        'Item Ten',
        'Item Eleven',
        'Item Twelve',
        'Item Thirteen',
      ],
      paginate: ['items'],
    };
  },
};
</script>

<style lang="sass">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  font-size: 20px
  text-align: center
  color: #2c3e50
  margin-top: 60px

h1, h2
  font-weight: normal

ul
  list-style-type: none
  padding: 0


li
  display: inline-block
  margin: 0 10px


.paginate-list
  width: 159px
  margin: 0 auto
  text-align: left
  li
    display: block
    &:before
      content: '⚬ '
      font-weight: bold
      color: slategray

.paginate-links.items
  user-select: none
  a
    cursor: pointer

  li.active a
    font-weight: bold

  li.next:before
    content: ' | '
    margin-right: 13px
    color: #ddd

  li.disabled
    a, polyline
      stroke: #ccc
      color: #ccc
      cursor: no-drop

a
  color: #42b983

</style>
