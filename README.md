# vue-paginate

> This plugin helps you use pagination on lists within seconds!

It's basically a directive with a bunch of methods defined on the vm. When you
use this directive on some list, it'll be sliced according to the number of
items per page, which you specify. Then, you'll work with those slices using the
methods & data that automatically gets defined on the vm — not all vms, only the
one you used the directive in.

## Setup

```
npm install vue-paginate --save
```

You have two ways to setup *vue-paginate*:

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

Include it directly with a `<script>` tag. In this case, you don't need to write
`Vue.use(VuePaginate)`, this will be done automatically for you.

## Usage

Here's an example:

```js
new Vue({
  el: '#app',
  data: {
    langs: ['PHP', 'JavaScript', 'HTML', 'CSS', 'Ruby', 'Python']
  }
});
```

```html
<!-- data -->
<ul v-paginate:3="langs">
  <li v-for="lang in langs">
    {{ lang }}
  </li>
</ul>

<!-- links -->
<ul>
  <li v-for="langLink in langsLinks">
    <a @click="changeLangsPage(langLink)" href="#">
      {{ langLink + 1 }}
    </a>
  </li>
</ul>
```

That's it!

#### How it works?

When you try the previous example, you'll get two pages, each one contains three
items. We specified that by using `:3` argument, which means we want to show 3
items per page!

In the links section, we used a variable named `langsLinks`. This one is
generated for us by the plugin, which follows the convention `[listName]Links`.
This variable contains the total number of pages needed to display the whole
list.

To show the links, we ran a loop — to get all page numbers, from zero to the
last one — and used each one in the method `changeLangsPage()` (which also
follows a convention: `change[listName]Page`). This method takes the page number
and return all items in that page.

#### Use Next/Prev buttons

In some cases, you'll want to navigate pages using next/prev links instead of
page numbers.

To do that, all you have to do is to use the methods `next[listName]Page` &
`prev[listName]Page`.

Like this:

```html
<!-- links -->
<a @click="prevLangsPage()" href="#">
  Prev
</a>

<a @click="nextLangsPage()" href="#">
  Next
</a>
```

#### Accessing the full version

This plugin operates on the original data that you've defined in your vm. This
means, you'll no longer have access to the full version (before slicing).

However, before the plugin does its slicing, it stores the full version in
another list named `full[listName]`. So for this example it would be
`fullLangs`.

## Conventions

#### Methods

- `change[listName]Page`: Go to a specific page (using the page number).
- `next[listName]Page`: Go to the next page.
- `prev[listName]Page`: Go to the previous page.

#### Data

- `[listName]Links`: The total number of pages of the list.
- `full[listName]`: The full version of the list (before slicing).
- `current[listName]Page`: The current page of the list you're viewing (e.g. `currentLangsPage`).
