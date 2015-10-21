/** @module queried/closest */
var doc = require('get-doc');
var matches = require('queried/lib/pseudos/matches');
var isNode = require('mutype/is-node');


/**
* Get closest parent matching selector (or self)
*/
module.exports = function(e, q, checkSelf, within){
	if (!(isNode(e))) throw Error('Bad argument ' + e);

	within = within || doc;

	//root el is considered the topmost
	if (e === doc) return doc.documentElement;

	if (checkSelf) {
		if (!q || (isNode(q) ? e == q : matches(e, q))) return e;
	}

	while ((e = e.parentNode) && e !== doc) {
		if (!q || (isNode(q) ? e == q : matches(e, q))) return e;
	}
};