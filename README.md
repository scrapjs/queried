# queried [![Build Status](https://travis-ci.org/dfcreative/queried.svg?branch=master)](https://travis-ci.org/dfcreative/queried) [![Code Climate](https://codeclimate.com/github/dfcreative/queried/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/queried)

_Queried_ is tiny normalized query selector. It just wraps native `querySelector` and provides hooks for custom pseudos. Basically it polyfills CSS4 pseudos, but might be used to implement other pseudos, like jQuery ones or query-relative.

1. Polyfills CSS3 & CSS4 pseudos: `:has`, `:scope`, `:root`, `:matches`.

2. Fixes immediate children selector `> *`, which is unavailable in _query_.

3. Returns `Array` instead of `NodeList` in multiple query, so you can do `forEach` on result.

7. Accepts other elements as a selector, for example, to find within a set.

7. Fully compliant with [query](https://github.com/component/query).


Use it if you need CSS4 pseudos or other specific pseudos.

Otherwise take a look at analogs:

* [sel](https://github.com/amccollum/sel) — a more complete CSS4 selector, lacks of mapping pseudos and unable to handle nested pseudos like `:not(:has(a))`
* [query-component](http://npmjs.org/package/query-component) - a tiny wrapper over native `querySelector` with fallback to engines like qwery etc.
* dom-select
* qwery
* domy-element
* [query-relative](http://npmjs.org/package/query-relative) — extension to queried with relative pseudos like `:parent`, `:closest()`, `:next()`, `:prev()`.
* jquery


`$ npm install queried`

```js
var q = require('queried');

//select each div having `a` with `span` inside as immediate children.
q.all('div:has(a:has(span))');
```

# API

Fully compliant with [query-component](https://npmjs.org/package/query-component).

| Method | Description |
|---|---|
| _query(selector, el=document)_ | Query a single element by selector |
| _query.all(selector, el=document)_ | Query list of elements by selector |
| _query.registerFilter(name, filterFn)_ | Register a filtering pseudo |
| _query.registerMapper(name, mapperFn)_ | Register a mapping pseudo |
| _query.document_ | Default document to use as fallback. Set it up, for exampl, as `q.document = require('min-document')`, if you need custom DOM. |



[![NPM](https://nodei.co/npm/queried.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/queried/)

<a href="UNLICENSE"><img src="http://upload.wikimedia.org/wikipedia/commons/6/62/PD-icon.svg" width="20"/></a>