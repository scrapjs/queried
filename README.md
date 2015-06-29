# queried [![Build Status](https://travis-ci.org/dfcreative/queried.svg?branch=master)](https://travis-ci.org/dfcreative/queried) [![Code Climate](https://codeclimate.com/github/dfcreative/queried/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/queried)

_Queried_ is a convenient wrapper for _querySelector_.

7. [query](https://github.com/component/query)-compliant API.

3. Returns `Array` instead of `NodeList` in multiple query: `q.all('.block').forEach(function (el) { ... } )`.

7. Accepts other elements or array as a selector: `q.all(['.block', self.el]);`.

1. Polyfills CSS3 & CSS4 pseudos: `:has`, `:scope`, `:root`, `:matches`.

2. Fixes immediate children selector `> *`: `q.all('> *', element);`.

7. Normalizes nested :not’s: `:not(a:not(:target))`.


## Usage

[![npm install queried](https://nodei.co/npm/queried.png?mini=true)](https://npmjs.org/package/queried)


```js
var q = require('queried');

//select each div having `a` with `span` inside as immediate children.
q.all('div:has(a:has(span))');
```

## API

| Method | Description |
|---|---|
| _query(selector, el=document)_ | Query a single element by selector |
| _query.all(selector, el=document)_ | Query list of elements by selector |
| _query.document_ | Default document to use. Change it, if you need custom DOM, like `q.document = require('dom-lite').document`. |


## Similar

* [sel](https://github.com/amccollum/sel) — a more complete CSS4 selector, lacks of mapping pseudos and unable to handle nested pseudos like `:not(:has(a))`
* [query-component](http://npmjs.org/package/query-component) - a tiny wrapper over native `querySelector` with fallback to engines like qwery etc.
* [dom-select](https://www.npmjs.com/package/dom-select) === [select-dom](https://www.npmjs.com/package/select-dom)
* [qwery](https://www.npmjs.com/package/qwery)
* [domy-element](https://www.npmjs.com/package/domy-element)
* [jquery](https://www.npmjs.com/package/jquery)