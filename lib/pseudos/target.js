/**
 * :target pseudo.
 * If element is a target on the page, i.e. is accessible as `#something` i.e. has id.
 *
 * http://dev.w3.org/csswg/selectors-4/#the-target-pseudo
 */

module.exports = function target(el){
	return el.hasAttribute('id');
};