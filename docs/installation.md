# Installation

## Direct Download / CDN

https://unpkg.com/karuselo/dist/karuselo 

[unpkg.com](https://unpkg.com) provides NPM-based CDN links. The above link will always point to the latest release on NPM. You can also use a specific version/tag via URLs like https://unpkg.com/karuselo@{{ $version }}/dist/karuselo.js
 
Include karuselo after Vue and it will install itself automatically:

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/karuselo/dist/karuselo.js"></script>
```

## NPM

```sh
$ npm install karuselo
```

## Yarn

```sh
$ yarn add karuselo
```

When used with a module system, you must explicitly install the `karuselo` via `Vue.use()`:

```javascript
import Vue from 'vue'
import karuselo from 'karuselo'

Vue.use(karuselo)
```

You don't need to do this when using global script tags.

## Dev Build

You will have to clone directly from GitHub and build `karuselo` yourself if
you want to use the latest dev build.

```sh
$ git clone https://github.com//karuselo.git node_modules/karuselo
$ cd node_modules/karuselo
$ npm install
$ npm run build
```

