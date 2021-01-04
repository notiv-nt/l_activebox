/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20150312
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

// Full polyfill for browsers with no classList support
// Including IE < Edge missing SVGElement.classList
if (!("classList" in document.createElement("_"))
	|| document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = view.Element[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.setAttribute("class", this.toString());
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
		, index
	;
	do {
		token = tokens[i] + "";
		index = checkTokenAndGetIndex(this, token);
		while (index !== -1) {
			this.splice(index, 1);
			updated = true;
			index = checkTokenAndGetIndex(this, token);
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, force) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			force !== true && "remove"
		:
			force !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	if (force === true || force === false) {
		return force;
	} else {
		return !result;
	}
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
	"use strict";

	var testElement = document.createElement("_");

	testElement.classList.add("c1", "c2");

	// Polyfill for IE 10/11 and Firefox <26, where classList.add and
	// classList.remove exist but support only one argument at a time.
	if (!testElement.classList.contains("c2")) {
		var createMethod = function(method) {
			var original = DOMTokenList.prototype[method];

			DOMTokenList.prototype[method] = function(token) {
				var i, len = arguments.length;

				for (i = 0; i < len; i++) {
					token = arguments[i];
					original.call(this, token);
				}
			};
		};
		createMethod('add');
		createMethod('remove');
	}

	testElement.classList.toggle("c3", false);

	// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	// support the second argument.
	if (testElement.classList.contains("c3")) {
		var _toggle = DOMTokenList.prototype.toggle;

		DOMTokenList.prototype.toggle = function(token, force) {
			if (1 in arguments && !this.contains(token) === !force) {
				return force;
			} else {
				return _toggle.call(this, token);
			}
		};

	}

	testElement = null;
}());

}

}

var
		navBtn = document.querySelector('button.nav-toggle'),
		nav = document.querySelector('header.main-header nav'),
		dqA = document.querySelectorAll.bind(document),
		dq = document.querySelector.bind(document),
		bannerHeight = dq('section.banner').clientHeight
		;


function slider(root, nav) {

	var count = dq(root).children.length,
			navEl = dq(nav);

	if (count < 1)
		return;

	for (var i = 0; i < count; i++) {
		var link = document.createElement('A');
		link.setAttribute('data-index', i + 1);

		link.addEventListener('click', function(e) {
			e.preventDefault();

			var index = this.getAttribute('data-index');

			console.log(nav + ' a, ' + root + ' .item');
			dqA(nav + ' a, ' + root + ' .item')
				.each(function(elem) {
					elem.classList.remove('active');
				});

			this.classList.add('active');
			dq(root + ' .item:nth-of-type(' + index + ')').classList.add('active');
		});

		navEl.appendChild(link);
	}

	dq(nav + ' a').classList.add('active')
	dq(root + ' .item').classList.add('active');

}

function toggleNav() {

	if (navBtn.classList.contains('active') && nav.classList.contains('show')) {
		navBtn.classList.remove('active');
		nav.classList.remove('show');
	} else {
		navBtn.classList.add('active');
		nav.classList.add('show');
	}

}

function scrollTo(elem) {

	var el = dq(elem),
			offset = el.offsetTop - ( dq('header.main-header').clientHeight ),
			time = 300,
			wy = window.scrollY;

	if(!el)
		return;

	var scrollOffset = offset - wy;
	var iter = (offset - wy) / time * 1000 / 60;
	var offsetTo = iter;

	var interval = setInterval(function() {
		offsetTo += iter;

		window.scroll(window.scrollX, wy + offsetTo);
	}, 1000/60);

	setTimeout(function() {
		clearInterval(interval);
	}, time)

	return true;

}



NodeList.prototype.each = Array.prototype.forEach;

navBtn.addEventListener('click', function(e) {
	e.preventDefault();

	toggleNav();
});

dqA('header.main-header nav a')
	.each(function(link) {

		link.addEventListener('click', function(e) {

			var hash = this.getAttribute('href');

			if (dq('header.main-header nav').classList.contains('show')) {
				toggleNav();
			}

			dqA('header.main-header nav a').each(function(elem) {
				elem.classList.remove('active');
			})

			if (scrollTo(hash)) {
				e.preventDefault();
				this.classList.add('active');
				document.location.hash = '';
			}

		})

	});

function fixNav() {

	if (window.scrollY > bannerHeight) {

		if (!dq('header.main-header').classList.contains('fixed'))
			dq('header.main-header').classList.add('fixed')

	} else {

		if (dq('header.main-header').classList.contains('fixed'))
			dq('header.main-header').classList.remove('fixed')

	}

};

window.addEventListener('scroll', fixNav);

window.addEventListener('resize', function() {

	bannerHeight = dq('section.banner').clientHeight;

})

slider('.slider', '.slider-dots');
fixNav();

