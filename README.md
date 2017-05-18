# vue-paginate

> This version only works with Vue 2.0. For Vue 1.0, check out the [1.0 branch](https://github.com/TahaSh/vue-paginate/tree/1.0).

The idea of `vue-paginate` is pretty simple. You give it an array of items; specify how many items per page; then get your list of items paginated!

## Setup

```
npm install vue-paginate --save
```

You have two ways to setup `vue-paginate`:

#### CommonJS (Webpack/Browserify)

- ES6

```js
import VuePaginate from 'vue-paginate'
Vue.use(VuePaginate)
```

- ES5

```js
var VuePaginate = require('vue-paginate')
Vue.use(VuePaginate)
```

#### Include

Include it directly with a `<script>` tag. In this case, you don't need to write `Vue.use(VuePaginate)`, this will be done automatically for you.

## Usage

> Before you start, you may want to check a live example on [jsfiddle](https://jsfiddle.net/taha_sh/hmapx482/).

`vue-paginate` consists of two main components: `Paginate` and `PaginateLinks`. And both get registered globally once the plugin is installed.

To paginate any list of data, we have to follow these three small steps:

1. Register the name of the paginated list.
2. Use `Paginate` component to paginate and display the paginated list.
3. Use `PaginateLinks` component to display the links for the pagination.

Now, let’s see them in an example:

### Example

In this example, we have a small list of items registered in our data list.
 
``` js
new Vue({
  el: '#app',
  data: {
    langs: ['JavaScript', 'PHP', 'HTML', 'CSS', 'Ruby', 'Python', 'Erlang']
  }
})
```

Now, let’s see how we can paginate this list to display two items per page.

First step is to register the name of our future paginated list. We register it by adding it to an array called `paginate`.

``` js
new Vue({
  el: '#app',
  data: {
    langs: ['JavaScript', 'PHP', 'HTML', 'CSS', 'Ruby', 'Python', 'Erlang'],
    paginate: ['languages']
  }
})
```

Note that you can name it the same as the original list – I named it differently here just for the sake of clarity.

Second step is to use the `Paginate` component to paginate the list. Since it was globally registered by the plugin, you don’t have to import it.

This component requires at least two props to be passed. The `name` of the registered paginated list – `languages` in this case. And the `list` that you want to paginate – `langs` in this case.

After that, you start using the paginated list inside the body of that `<paginate>` component. And, you get access to the paginated list using the method `paginated('languages')`.

Here’s how it looks in action:

``` html
<paginate
  name="languages"
  :list="langs"
  :per="2"
>
  <li v-for="lang in paginated('languages')">
    {{ lang }}
  </li>
</paginate>
```

Note how we specified the number of items per page using the `per` prop. If we didn’t specify it here, it would use the default value instead, which is `3` items per page.

That’s it! Now your list has been paginated successfully. And you still have access to the original `langs` list if you need it.

However, we still don’t have a way to navigate through those pages. Here’s where `PaginateLinks` component comes into play.

All that component needs to know is the name of the registered paginated list. We pass that using its `for` prop. Like this:

``` html
<paginate-links for="languages"></paginate-links>
```

So, that was the third step!

### Rendering PaginateLinks asynchronously

A common error users get when using this plugin is this:

> [vue-paginate]: <paginate-links for="items"> can't be used without its companion <paginate name="items">

This error occurs for two reasons:
1. You haven't added your `<paginate>` yet! — Just add it and it will be fixed.
2. Or your defined `<paginate>` component is rendered after its companion `<paginate-links>` has been rendered (usually happens when using `v-if` on `<paginate>` or on one of its parents)

Here's some contrived example of the second case:

``` html
<paginate v-if="shown"
  name="items"
  :list="items"
>
  <li v-for="item in paginated('items')">
    {{ item }}
  </li>
</paginate>
<paginate-links for="items"></paginate-links>
```

``` js
new Vue({
  el: '#app',
  data: {
    langs: ['JavaScript', 'PHP', 'HTML', 'CSS', 'Ruby', 'Python', 'Erlang'],
    paginate: ['languages'],
    shown: false
  },
  mounted () {
    setTimeout(() => {
      this.shown = true
    }, 1000)
  }
})
```

If you try this example in the browser, you'll see the error described in this section. And the reason for that is because our `PaginateLinks` component can't find its companion `Paginate` component to show the links for — since it takes a complete second to render itself.

To fix this issue we have to tell our `PaginateLinks` to wait for its companion `Paginate` component to be rendered first. And we can do that simply by using `:async="true"` on `<paginate-links>`.

``` html
<paginate-links for="items" :async="true"></paginate-links>
```
*So the bottom line is this: `<paginate>` component should always be rendered before `<paginate-links>` component.*

### Types of paginate links

`vue-paginate` provides us with three different types of pagination links:

1. Full list of links. This is the default behavior, which displays all available page links from page 1 to N.
2. Simple links. It contains only two links: *Previous* and *Next*.
3. Limited links. It limits the number of displayed links, and provides left and right arrows to help you navigate between them.

#### Full links

To use this you don’t have to do anything; this is the default behavior.

#### Simple links

For this, we use the `simple` prop, which accepts an object that contains the names of the *Previous* and *Next* links. For example:

``` html
<paginate-links
  for="languages"
  :simple="{
    prev: 'Back',
    next: 'Next'
  }"
></paginate-links>
```


#### Limited links

To activate this mode, you just need to specify the limit using the `limit` prop. Like this:

``` html
<paginate-links
  for="languages"
  :limit="2"
></paginate-links>
```

### Step Links

As in simple links, you can have next/previous links — which I call step links — in full links and limited links. To add them, use `:show-step-links="true"` prop on the `PaginateLinks` component you want. For example:

``` html
<paginate-links
  for="languages"
  :show-step-links="true"
></paginate-links>
```

#### Customizing step links

The default symbols for the step links are `«` for previous and `»` for next. But, of course, you can change them to what you want using the `:step-links` prop, like this:

``` html
<paginate-links for="languages"
  :show-step-links="true"
  :step-links="{
    next: 'N',
    prev: 'P'
  }"
></paginate-links>
```

### Listening to links @change event

When the current page changes, `PaginateLinks` emits an event called `change` to inform you about that. It also passes the switched page numbers with it, if you need them.

``` html
<paginate-links
  for="languages"
  @change="onLangsPageChange"
></paginate-links>
```

``` js
methods: {
  onLangsPageChange (toPage, fromPage) {
    // handle here…
  }
}
```

### Navigate pages programmatically

`Paginate` component exposes a method that allows you to go to a specific page manually (not through `PaginateLinks` component). That method is called `goToPage(pageNumber)`.

To access this method, you need to get an access to your `<paginate>` component instance using `ref` property.

Here's an example:

``` html
<paginate ref="paginator"
  name="items"
  :list="items"
>
  <li v-for="item in paginated('items')">
    {{ item }}
  </li>
</paginate>
<button @click="goToSecondPage">Go to second page</button>
```

``` js
methods: {
  goToSecondPage () {
    if (this.$refs.paginator) {
      this.$refs.paginator.goToPage(2)
    }
  }
}
```

### Displaying page items count (`X-Y of Z`)

A common need for paginated lists is to display the items count description of the currently viewed items. It's usually displayed in this format `X-Y of Z` (e.g. `1-3 of 14`).

You can get that from your `<paginate>` component instance's `pageItemsCount` computed property. And in order to use that, you have to get an access to that component instance using `ref` property.

An example:

``` html
<paginate ref="paginator"
  name="items"
  :list="items" 
>
  <li v-for="item in paginated('items')">
    {{ item }}
  </li>
</paginate>
<paginate-links for="items"></paginate-links>

<span v-if="$refs.paginator">
  Viewing {{$refs.paginator.pageItemsCount}} results
</span>
```

An important thing to note here is `v-if="$refs.paginator"`. We needed to do that check to make sure our `<paginate>` component instance is completely rendered first. Otherwise, we'll get this error:

`Cannot read property 'pageItemsCount' of undefined"`

### Paginate container

The default element `vue-paginate` uses for the `<paginate>` container is `UL`. But, of course, you can change it to whatever you want using the `tag` prop. And the same is true for its class using the `class` prop.

``` html
<paginate
  name="languages"
  :list="langs"
  :per="2"
  tag="div"
  class="paginate-langs"
>
  <li v-for="lang in paginated('languages')">
    {{ lang }}
  </li>
</paginate>
```

### Updating the full list

Since this plugin is built using the components system, you get all the flexibility and power that regular Vue components provide. I’m talking here specifically about the reactivity system.

So, when you want to update the original list (e.g. `langs`), just update it; everything will work seamlessly!

### Filtering the paginated list

There’s nothing special the plugin does to support list filtering. It’s your responsibility to filter the list you pass to `<paginate>` component via `list` prop.

So, if we were to filter the list (or any other operation), we would have something similar to this:

``` js
// Assume we have a text input bound to `searchLangs` data via v-model for example.
computed: {
  fLangs () {
    const re = new RegExp(this.searchLangs, 'i')
    return this.langs.filter(lang => lang.match(re))
  }
}
```

Then just pass that `fLangs` to the `list` prop instead of the original `langs`.

### Hide single page

By default, paginated links will always be displayed even if there's only one page. But sometimes you want to hide it when there's a single page — especially after filtering the items. The plugin allows you to do so by using the `:hide-single-page="true"` prop.

``` html
<paginate-links for="items"
  :hide-single-page="true"
></paginate-links>
```

### Links customization

In `vue-paginate`, you can customize every bit of your pagination links.

But first, let’s see the html structure used for all link types:

``` html
<ul>
  <li><a>1</a></li>
  <li><a>2</a></li>
  <!-- … -->
</ul>
```

Now, let’s see what CSS selectors we often need to use:

#### All links containers:

`ul.paginate-links`

#### Specific links container:

`ul.paginate-links.languages`

`languages` here is the name of your paginated list.

#### Current page:

This only works for full & limited links.

`ul.paginate-links > li.active > a`

#### Previous & Next Links:

Obviously, this is only for simple links.

Previous –> `ul.paginate-links > li.prev > a`

Next –> `ul.paginate-links > li.next > a`

#### Disabled Next/Previous Links:

`ul.paginate-links > li.disabled > a`

#### Limited Links:

Number links –> `ul.paginate-links > li.number > a`

Left arrow –> `ul.paginate-links > li.left-arrow > a`

Right arrow –> `ul.paginate-links > li.right-arrow > a`

Ellipses –> `ul.paginate-links > li.ellipses > a`

#### Adding additional classes

In some cases, especially when you're using a CSS framework, you'll need to add additional classes to your links elements. You can do so simply by using the `classes` prop on your `PaginateLinks` component. This prop takes an object that contains the element's selector as the key, and the class you want to add as the value.

Here's an example:

``` html
<paginate-links
  for="languages"
  :simple="{
    prev: 'Back',
    next: 'Next'
  }"
  :classes="{
    'ul': 'simple-links-container',
    '.next > a': 'next-link',
    '.prev > a': ['prev-link', 'another-class'] // multiple classes
  }"
></paginate-links>
```

Note that this feature works on all link types – full links, simple links, and limited links.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016–2017 Taha Shashtari