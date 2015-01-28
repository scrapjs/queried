var assert = require('assert');
var q = require('..');


//shortcuts
var doc = document, root = document.documentElement;


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
var c = document.createElement('div');
c.className = 'container';
var p = document.createElement('div');
p.className = 'parent';
var t = document.createElement('div');
t.className = 'target';
var f = document.createElement('div');
f.className = 'first';
var s = document.createElement('div');
s.className = 'second';
var l = document.createElement('div');
l.className = 'last';
var i = document.createElement('div');
i.className = 'inner';


document.body.appendChild(c);
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
		assert.equal(q(window), window);
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
		assert.equal(q('.target', window), t);
	});
});



describe('css4', function(){
	it(':has(selector)', function(){
		assert.equal(q('.container:has(.target)'), c);
		assert.equal(q('.container:has(.target, .last)'), c);
		assert.equal(q('.container:has(.x)'), undefined);
	});

	it(':matches(selector)', function(){
		assert.equal(q('.container:matches(.container)'), c);
		assert.equal(q('.container:matches(.container, .last)'), c);
		assert.equal(q('.container:matches(.x)'), undefined);
	});
});