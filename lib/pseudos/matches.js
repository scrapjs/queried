var q = require('..');
var doc = require('get-doc');

/** CSS4 matches */
function matches(el, selector){
	if (!el.parentNode) {
		var fragment = doc.createDocumentFragment();
		fragment.appendChild(el);
	}
	return q.all(selector, el.parentNode).indexOf(el) > -1;
}

module.exports = matches;