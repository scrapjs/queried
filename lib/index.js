/**
 * A query engine (with no pseudo classes yet).
 *
 * @module queried/lib/index
 */

//TODO: :within selector
//TODO: jquery selectors
//TODO: test order of query result (should be compliant with querySelectorAll)
//TODO: third query param - include self
//TODO: .closest, .all, .next, .prev, .parent, .filter, .mathes etc methods - all with the same API: query(selector, [el], [incSelf], [within]).
//TODO: .all('.x', '.selector');
//TODO: use universal pseudo mapper/filter instead of separate ones.


var slice = require('sliced');
var unique = require('array-unique');
var getUid = require('get-uid');
var paren = require('parenthesis');
var isString = require('mutype/is-string');
var isArray = require('mutype/is-array');
var isArrayLike = require('mutype/is-array-like');
var arrayify = require('arrayify-compact');
var doc = require('get-doc');


/** Registered pseudos */
var pseudos = {};
var filters = {};
var mappers = {};


/** Regexp to grab pseudos with params */
var pseudoRE;


/**
 * Append a new filtering (classic) pseudo
 *
 * @param {string} name Pseudo name
 * @param {Function} filter A filtering function
 */
function registerFilter(name, filter, incSelf){
	if (pseudos[name]) return;

	//save pseudo filter
	pseudos[name] = filter;
	pseudos[name].includeSelf = incSelf;
	filters[name] = true;

	regenerateRegExp();
}


/**
 * Append a new mapping (relative-like) pseudo
 *
 * @param {string} name pseudo name
 * @param {Function} mapper map function
 */
function registerMapper(name, mapper, incSelf){
	if (pseudos[name]) return;

	pseudos[name] = mapper;
	pseudos[name].includeSelf = incSelf;
	mappers[name] = true;

	regenerateRegExp();
}


/** Update regexp catching pseudos */
function regenerateRegExp(){
	pseudoRE = new RegExp('::?(' + Object.keys(pseudos).join('|') + ')(\\\\[0-9]+)?');
}


/**
 * Query wrapper - main method to query elements.
 */
function queryMultiple(selector, el) {
	//ignore bad selector
	if (!selector) return [];

	//return elements passed as a selector unchanged (cover params case)
	if (!isString(selector)) {
		if (isArray(selector)) {
			return unique(arrayify(selector.map(function (sel) {
				return qPseudos(el, sel);
			})));
		} else {
			return [selector];
		}
	}

	//catch polyfillable first `:scope` selector - just erase it, works just fine
	if (pseudos.scope) selector = selector.replace(/^\s*:scope/, '');

	//ignore non-queryable containers
	if (!el) el = [querySingle.document];

	//treat passed list
	else if (isArrayLike(el)) {
		el = arrayify(el);
	}

	//if element isn’t a node - make it q.document
	else if (!el.querySelector) {
		el = [querySingle.document];
	}

	//make any ok element a list
	else el = [el];

	return qPseudos(el, selector);
}


/** Query single element - no way better than return first of multiple selector */
function querySingle(selector, el){
	return queryMultiple(selector, el)[0];
}


/**
 * Return query result based off target list.
 * Parse and apply polyfilled pseudos
 */
function qPseudos(list, selector) {
	//ignore empty selector
	selector = selector.trim();
	if (!selector) return list;

	// console.group(selector);

	//scopify immediate children selector
	if (selector[0] === '>') {
		if (!pseudos.scope) {
			//scope as the first element in selector scopifies current element just ok
			selector = ':scope' + selector;
		}
		else {
			var id = getUid();
			list.forEach(function(el){el.setAttribute('__scoped', id);});
			selector = '[__scoped="' + id + '"]' + selector;
		}
	}

	var pseudo, pseudoFn, pseudoParam, pseudoParamId;

	//catch pseudo
	var parts = paren.parse(selector);
	var match = parts[0].match(pseudoRE);

	//if pseudo found
	if (match) {
		//grab pseudo details
		pseudo = match[1];
		pseudoParamId = match[2];

		if (pseudoParamId) {
			pseudoParam = paren.stringify(parts[pseudoParamId.slice(1)], parts);
		}

		//pre-select elements before pseudo
		var preSelector = paren.stringify(parts[0].slice(0, match.index), parts);

		//fix for query-relative
		if (!preSelector && !mappers[pseudo]) preSelector = '*';
		if (preSelector) list = qList(list, preSelector);


		//apply pseudo filter/mapper on the list
		pseudoFn = function(el) {return pseudos[pseudo](el, pseudoParam); };
		if (filters[pseudo]) {
			list = list.filter(pseudoFn);
		}
		else if (mappers[pseudo]) {
			list = unique(arrayify(list.map(pseudoFn)));
		}

		//shorten selector
		selector = parts[0].slice(match.index + match[0].length);

		// console.groupEnd();

		//query once again
		return qPseudos(list, paren.stringify(selector, parts));
	}

	//just query list
	else {
		// console.groupEnd();
		return qList(list, selector);
	}
}


/** Apply selector on a list of elements, no polyfilled pseudos */
function qList(list, selector){
	return unique(arrayify(list.map(function(el){
		return slice(el.querySelectorAll(selector));
	})));
}


/** Exports */
querySingle.all = queryMultiple;
querySingle.registerFilter = registerFilter;
querySingle.registerMapper = registerMapper;

/** Default document representative to use for DOM */
querySingle.document = doc;

module.exports = querySingle;