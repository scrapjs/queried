var q = require('..');

module.exports = function root(el){
	return el === q.document.documentElement;
};