/**
 * A query engine (with no pseudo classes yet).
 *
 * @module queried/lib/index
 */

//TODO: automated tests
//TODO: jquery selectors
//TODO: query-relative integration


var slice = require('sliced');
var unique = require('array-unique');
var doc = require('get-doc');
var getUid = require('get-uid');
var paren = require('parenthesis');
var isString = require('mutype/is-string');
var isArray = require('mutype/is-array');
var arrayify = require('arrayify-compact');


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
function registerFilter(name, filter){
	//save pseudo filter
	pseudos[name] = filter;
	filters[name] = true;

	regenerateRegExp();
}


/** Scope counter */
var scopeId = 0;


/**
 * Append a new mapping (relative-like) pseudo
 *
 * @param {[type]} name [description]
 * @param {[type]} mapper [description]
 *
 * @return {[type]} [description]
 */
function registerMapper(name, mapper){
	pseudos[name] = mapper;
	mappers[name] = true;

	regenerateRegExp();
}


/** Update regexp to catch pseudos */
function regenerateRegExp(){
	pseudoRE = new RegExp('::?(' + Object.keys(pseudos).join('|') + ')(\\\\[0-9]+)?');
}


/**
 * Query wrapper - main method to query elements.
 */
function queryMultiple(selector, el) {
	//ignore bad entry
	if (!selector) return [];

	//return elements itself
	if (!isString(selector)) return isArray(selector) ? selector : [selector];

	//ignore non-queryable containers
	if (!el || !el.querySelector) el = doc;

	return qPseudos([el], selector);
}


/** Apply single selector */
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

	//scopify immediate children
	if (selector[0] === '>') {
		if (!pseudos.scope) {
			//scope as the first element in selector scopes current element just ok
			selector = ':scope' + selector;
		}
		else {
			var id = getUid();
			el.setAttribute('__scoped', id);
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

		if (preSelector) {
			list = qList(list, preSelector);
		}

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
module.exports = querySingle;