var q = require('..');

function has(el, subSelector){
	return !!q(subSelector, el);
}

module.exports = has;