/**
 * @module  queried/css4
 *
 * CSS4 query selector.
 */


var doc = require('get-doc');
var q = require('./lib/');


/**
 * Detect unsupported css4 features, polyfill them
 */

//detect `:scope`
try {
	doc.querySelector(':scope');
}
catch (e) {
	q.registerPseudo('scope', require('./lib/pseudos/scope'));
}


//detect `:has`
try {
	doc.querySelector(':has');
}
catch (e) {
	q.registerPseudo('has', require('./lib/pseudos/has'));
}


//detect `:root`
try {
	doc.querySelector(':root');
}
catch (e) {
	q.registerPseudo('root', require('./lib/pseudos/root'));
}


//detect `:matches`
try {
	doc.querySelector(':matches');
}
catch (e) {
	q.registerPseudo('matches', require('./lib/pseudos/matches'));
}


module.exports = q;