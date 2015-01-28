var q = require('./');


/**
 * List of jquery pseudo filters
 */
q.registerPseudo('last', function(el, param){
	return el.nextSibling
});