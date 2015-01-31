var matches = require('./matches');

function not(el, selector){
	return !matches(el, selector);
}

module.exports = not;