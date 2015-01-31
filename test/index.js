var assert = require('chai').assert;
var q = require('..');
var matches = require('../lib/pseudos/matches');
var doc = require('get-doc') || require('dom-lite').document;
var win = typeof window !== 'undefined' ? window : {};


//shortcuts
var root = doc.documentElement;

//set up proper document
q.document = doc;


//create testing tree
/*
 <div class="container">
 	<div class="parent">
	 	<div class="first"></div>
	 	<div class="second"></div>
	 	<div class="target">
			<div class="inner"></div>
	 	</div>
	 	<div class="last"></div>
 	</div>
 </div>
 */
var c = doc.createElement('div');
c.className = 'container';
var p = doc.createElement('div');
p.className = 'parent';
var t = doc.createElement('div');
t.className = 'target';
var f = doc.createElement('div');
f.className = 'first';
var s = doc.createElement('div');
s.className = 'second';
var l = doc.createElement('div');
l.className = 'last';
var i = doc.createElement('div');
i.className = 'inner';


doc.body.appendChild(c);
c.appendChild(p);
p.appendChild(f);
p.appendChild(s);
p.appendChild(t);
p.appendChild(l);
t.appendChild(i);


describe('query-relative cases', function(){
	it(':root pseudo', function(){
		assert.equal(q(':root .target', t));
		assert.deepEqual(q.all(':root .target'), [t]);
		assert.equal(q(':root'), root);
	});

	it('generalizing', function(){
		assert.equal(q(p), p);
		assert.equal(q(p, t), p);
		assert.equal(q(win), win);
		assert.equal(q(doc), doc);
	});

	it('plain selectors', function(){
		assert.equal(q('body'), doc.body);
		assert.deepEqual(q.all('.first, .last'), [f, l]);
	});

	it('normalized children', function(){
		assert.deepEqual(q.all('> *', p), [f,s,t,l]);
		assert.deepEqual(q.all('> .first', p), [f]);
		assert.deepEqual(q.all('> *:nth-child(2)', p), [s]);
		assert.deepEqual(q.all(':scope > *', p), [f,s,t,l]);
		assert.deepEqual(q.all(':scope > .first', p), [f]);
		assert.deepEqual(q.all(':scope > *:nth-child(2)', p), [s]);
	});

	it('corner cases', function(){
		assert.deepEqual(q('', {}), undefined);
		assert.deepEqual(q('.some', {}), undefined);
		assert.deepEqual(q(), undefined);
		assert.deepEqual(q.all(null, null), []);
		assert.equal(q('.some', null), null);
		assert.equal(q('.target', win), t);
	});

	it(':has(:not(.target))', function(){
		assert.deepEqual(q.all(':has(:not(.target))', c), [p,t]);
	});
	it(':not(:has(.target))', function(){
		// console.log(q.all(':not(:has(.target))', c))
		assert.deepEqual(q.all(':not(:has(.target))', c), [f,s,t,i,l]);
	});

	it(':has(:matches(:not(.target)))', function(){
		assert.deepEqual(q.all(':has(:matches(:not(.target)))', c), [p,t]);
	});

	it('q.all(selector, [list])', function(){
		assert.deepEqual(q.all('.target, .first', [t,f,l,c]), [f,t]);
	});

	it.skip('q(list1, list2)', function(){

	});
});



describe('css4', function(){
	it(':has(selector)', function(){
		assert.equal(q('.container:has(.target)'), c);
		// assert.equal(q('.container:has(.target, .last)'), c);
		assert.equal(q('.container:has(.x)'), undefined);
	});

	it(':matches(selector)', function(){
		assert.equal(q('.container:matches(.container)'), c);
		// assert.equal(q('.container:matches(.container, .last)'), c);
		assert.equal(q('.container:matches(.x)'), undefined);
	});

	it('mathces-selector tests', function(){
		var ul = doc.createElement('ul');
		var li = doc.createElement('li');
		ul.appendChild(li);
		var em = doc.createElement('em');
		li.appendChild(em);

		assert(true === matches(em, 'ul li em'), 'em = "ul li em"');
		assert(true === matches(em, 'ul em'), 'em = "ul em"');
		assert(true === matches(em, 'ul > li > em'), 'em = "ul > li > em"');
		assert(false === matches(em, 'ul ul em'), 'em != "ul ul em"');

		assert(true === matches(li, 'ul li'), 'li = "ul li"');
		assert(true === matches(li, 'ul > li'), 'li = "ul > li"');
		assert(true === matches(li, 'li'), 'li = "li"');
		assert(false === matches(li, 'div > li'), 'li != "div > li"');

		assert(true == matches(ul, 'ul'), 'ul = "ul"');
		assert(false == matches(ul, 'body > ul'), 'ul != "body > ul"');
	});
});