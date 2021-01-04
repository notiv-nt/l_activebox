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
