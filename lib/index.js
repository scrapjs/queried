/**
 * A query engine (with no pseudo classes yet).
 *
 * @module queried/lib/index
 */

//TODO: automated tests
//TODO: jquery selectors
//TODO: query-relative integration


var slice = require('sliced');
var flatten = require('arr-flatten');
var unique = require('array-unique');
var doc = require('get-doc');
var getUid = require('get-uid');
var paren = require('parenthesis');
var isString = require('mutype/is-string');
var isArray = require('mutype/is-array');


/** Registered pseudos */
var pseudos = {};

/* Regexp to grab pseudos with params */
var pseudoRE;


/**
 * Append a new pseudo
 *
 * @param {string} name Pseudo name
 * @param {Function} filter A filtering function
 */
function registerPseudo(name, filter){
	//save pseudo filter
	pseudos[name] = filter;

	//regenerate pseudo RE
	pseudoRE = new RegExp('::?(' + Object.keys(pseudos).join('|') + ')(\\\\[0-9]+)?');
}


/** Scope counter */
var scopeId = 0;


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

	// console.groupEnd();

	//if pseudo found
	if (match) {
		//grab pseudo details
		pseudo = match[1];
		pseudoParamId = match[2];

		if (pseudoParamId) {
			pseudoParam = paren.stringify(parts[pseudoParamId.slice(1)], parts);
		}

		pseudoFn = pseudos[pseudo];

		//pre-select elements before pseudo
		var preSelector = paren.stringify(parts[0].slice(0, match.index), parts);

		list = qList(list, preSelector)

		//apply pseudo filter on the list
		.filter(function(el){
			return pseudoFn(el, pseudoParam);
		});

		//shorten selector
		selector = parts[0].slice(match.index + match[0].length);

		//query once again
		return qPseudos(list, paren.stringify(selector, parts));
	}

	//just query list
	else {
		return qList(list, selector);
	}
}


/** Apply selector on a list of elements, no polyfilled pseudos */
function qList(list, selector){
	return unique(flatten(list.map(function(el){
		return slice(el.querySelectorAll(selector));
	})));
}


/** Exports */
querySingle.all = queryMultiple;
querySingle.registerPseudo = registerPseudo;
module.exports = querySingle;