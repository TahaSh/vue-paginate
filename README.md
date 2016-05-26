# vue-paginate

> This plugin helps you use pagination on lists within seconds!

It's basically a directive with a bunch of methods defined on the vm. When you
use this directive on some list, it'll be sliced according to the number of
items per page, which you specify. Then, you'll work with those slices using the methods & data that automatically gets defined on the vm — not all vms, only the one you used the directive in.

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

Include it directly with a `<script>` tag. In this case, you don't need to write `Vue.use(VuePaginate)`, this will be done automatically for you.

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
      {{ langLink }}
    </a>
  </li>
</ul>
```

That's it!

#### How it works?

When you try the previous example, you'll get two pages, each one contains three items. We specified that by using `:3` argument, which means we want to show 3 items per page!

In the links section, we used a variable named `langsLinks`. This one is
generated for us by the plugin, which follows the convention `[listName]Links`.
This variable contains an array of all pages' numbers that we need to navigate the content of the list.

So, to show the links, we ran a loop and used each one in the method `changeLangsPage()` (which also follows a convention: `change[listName]Page`). This method takes the page number and return all items in that page.

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
another list named `full[listName]`. So, for this example it would be
`fullLangs`.

#### Limit the number of displayed links

When your number of pages gets bigger, it becomes unpractical to display all of your links. What we prefer to do instead is to limit the number of links displayed in the links section. Doing that with this plugin is a cinch!

All you have to do is to use `limited[listName]Links` in place of `[listName]Links`. As a default, your links will be limited to `4`, but of course you can change it by using the parameter `limit` along with `v-paginate`. For example:

``` html
<!-- Data -->
<section v-paginate:2="posts" limit="2">
  <ul v-for="post in posts">
    <li>{{ post }}</li>
  </ul>
</section>

<!-- Links -->
<ul class="links">
  <li v-for="postLink in limitedPostsLinks">
    <a :class="{active: currentPostsPage == postLink}" href="#" @click="changePostsPage(postLink)">{{ postLink }}</a>
  </li>
</ul>
```

#### Updating the full list manually

In many cases you will find the need to change/assign the content of the list manually — for example from an Ajax response. You can do that simply by changing the value of the full version of the list `full[listName]`. For example, here's how you would change your list content when performing an Ajax request:

``` js
this.$http.get('/posts')
  .then(function (response) {
    this.fullPosts = response.data;
  }
);
```


## Conventions

#### Methods

- `change[listName]Page`: Go to a specific page (using the page number).
- `next[listName]Page`: Go to the next page.
- `prev[listName]Page`: Go to the previous page.

#### Data

- `[listName]Links`: Array of the needed links.
- `limited[listName]Links`: Array of limited links.
- `full[listName]`: The full version of the list (before slicing).
- `current[listName]Page`: The current page of the list you're viewing (e.g. `currentLangsPage`).
- `has[listName]Links`: A check to see if there's a need to display the links.
