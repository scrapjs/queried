var q = require('..');

/** CSS4 matches */
function matches(el, selector){
	return q.all(selector, el.parentNode).indexOf(el) > -1;
}

module.exports = matches;