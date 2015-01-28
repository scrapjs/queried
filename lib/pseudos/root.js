var doc = require('get-doc');

module.exports = function root(el){
	return el === doc.documentElement;
};