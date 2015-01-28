/**
 * `:any-link` pseudo
 * Select any link-like element.
 *
 * @link http://dev.w3.org/csswg/selectors-4/#the-any-link-pseudo
 */

var matches = require('matches-selector');

module.exports = function anyLink(el){
	return matches(el, ':link, :visited');
}