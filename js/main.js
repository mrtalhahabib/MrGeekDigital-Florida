/* ==========================================================================
   MrGeek Digital Marketing Agency — main.js
   Home page interactions. Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. Sticky header state
  ------------------------------------------------------------------ */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     2. Mobile menu
  ------------------------------------------------------------------ */
  var body = document.body;
  var toggle = document.querySelector('.nav__toggle');
  var panel = document.getElementById('nav-panel');

  function openMenu() {
    body.classList.add('menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }
  function closeMenu() {
    body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      body.classList.contains('menu-open') ? closeMenu() : openMenu();
    });
  }
  document.querySelectorAll('[data-menu-close]').forEach(function (el) {
    el.addEventListener('click', closeMenu);
  });
  // close when a link inside the panel is used
  panel.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  // close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // mobile accordions
  document.querySelectorAll('[data-acc]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var acc = btn.closest('.m-acc');
      var inner = acc.querySelector('.m-acc__inner');
      var open = acc.classList.toggle('m-acc--open');
      inner.setAttribute('aria-hidden', open ? 'false' : 'true');
    });
  });

  /* ------------------------------------------------------------------
     3. Scroll reveal
  ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ------------------------------------------------------------------
     4. Animated counters (hero stats + case-study metrics)
  ------------------------------------------------------------------ */
  function formatNumber(val, decimals) {
    return val.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    if (prefersReduced) {
      el.textContent = prefix + formatNumber(target, decimals) + suffix;
      return;
    }
    var duration = 1500;
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = prefix + formatNumber(target * eased, decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll('.counter, .case-metrics [data-count]');
  if ('IntersectionObserver' in window) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          countObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countObs.observe(el); });
  }

  /* ------------------------------------------------------------------
     5. Reviews carousel
  ------------------------------------------------------------------ */
  (function reviewsCarousel() {
    var track = document.getElementById('reviews-track');
    if (!track) return;
    var slides = track.children;
    var index = 0;
    var timer = null;
    var dotsWrap = document.getElementById('rev-dots');

    for (var i = 0; i < slides.length; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
      dot.addEventListener('click', (function (n) {
        return function () { goTo(n, true); };
      })(i));
      dotsWrap.appendChild(dot);
    }
    var dots = dotsWrap.children;

    function goTo(n, user) {
      index = (n + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      for (var d = 0; d < dots.length; d++) {
        dots[d].classList.toggle('is-active', d === index);
      }
      if (user) restart();
    }
    function next() { goTo(index + 1); }
    function restart() {
      if (timer) clearInterval(timer);
      if (!prefersReduced) timer = setInterval(next, 6000);
    }

    var prevBtn = document.getElementById('rev-prev');
    var nextBtn = document.getElementById('rev-next');
    prevBtn.addEventListener('click', function () { goTo(index - 1, true); });
    nextBtn.addEventListener('click', function () { goTo(index + 1, true); });

    var viewport = document.getElementById('reviews-viewport');
    viewport.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
    viewport.addEventListener('mouseleave', restart);

    // swipe support
    var startX = null;
    viewport.addEventListener('pointerdown', function (e) { startX = e.clientX; }, { passive: true });
    viewport.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var delta = e.clientX - startX;
      if (Math.abs(delta) > 42) goTo(delta < 0 ? index + 1 : index - 1, true);
      startX = null;
    }, { passive: true });

    goTo(0);
    restart();
  })();

  /* ------------------------------------------------------------------
     6. Florida map — interactive cities
  ------------------------------------------------------------------ */
  (function floridaMap() {
    var dots = document.querySelectorAll('.city-dot');
    var chipsWrap = document.getElementById('city-chips');
    var nameEl = document.getElementById('city-name');
    var subEl = document.getElementById('city-sub');
    var agentsEl = document.getElementById('city-agents');
    var kwsEl = document.getElementById('city-kws');
    if (!dots.length || !nameEl) return;

    var CITY_DATA = {
      'Miami':            { agents: 31, kws: 412, sub: 'Miami-Dade County · Gold Coast' },
      'Fort Lauderdale':  { agents: 24, kws: 296, sub: 'Broward County · Gold Coast' },
      'West Palm Beach':  { agents: 19, kws: 238, sub: 'Palm Beach County · Gold Coast' },
      'Naples':           { agents: 17, kws: 205, sub: 'Collier County · Paradise Coast' },
      'Fort Myers':       { agents: 14, kws: 168, sub: 'Lee County · Gulf Coast' },
      'Sarasota':         { agents: 12, kws: 147, sub: 'Sarasota County · Gulf Coast' },
      'Tampa':            { agents: 27, kws: 381, sub: 'Hillsborough County · Gulf Coast' },
      'St. Petersburg':   { agents: 16, kws: 201, sub: 'Pinellas County · Gulf Coast' },
      'Orlando':          { agents: 24, kws: 349, sub: 'Orange County · Central Florida' },
      'Jacksonville':     { agents: 21, kws: 262, sub: 'Duval County · First Coast' },
      'Tallahassee':      { agents: 8,  kws: 94,  sub: 'Leon County · Big Bend' },
      'Pensacola':        { agents: 9,  kws: 112, sub: 'Escambia County · Panhandle' },
      'The Villages':     { agents: 11, kws: 139, sub: 'Sumter County · Central Florida' },
      'Florida Keys':     { agents: 6,  kws: 73,  sub: 'Monroe County · Island Keys' }
    };

    var CITY_SLUGS = {
      'Miami':'miami','Fort Lauderdale':'fort-lauderdale','West Palm Beach':'west-palm-beach',
      'Naples':'naples','Fort Myers':'fort-myers','Sarasota':'sarasota','Tampa':'tampa',
      'St. Petersburg':'st-petersburg','Orlando':'orlando','Jacksonville':'jacksonville'
    };

    function setActive(city, animateNums) {
      var data = CITY_DATA[city];
      if (!data) return;
      nameEl.textContent = city;
      subEl.textContent = data.sub;
      if (animateNums && !prefersReduced) {
        animateValue(agentsEl, parseInt(agentsEl.textContent, 10) || 0, data.agents, 500);
        animateValue(kwsEl, parseInt(kwsEl.textContent, 10) || 0, data.kws, 500);
      } else {
        agentsEl.textContent = data.agents;
        kwsEl.textContent = data.kws;
      }
      var go = document.querySelector('.city-card__go');
      if (go) {
        var slug = CITY_SLUGS[city];
        go.setAttribute('href', slug ? 'florida-markets/' + slug + '.html' : '#statewide-note');
      }
      dots.forEach(function (d) {
        d.classList.toggle('is-active', d.getAttribute('data-city') === city);
      });
      if (chipsWrap) {
        chipsWrap.querySelectorAll('button').forEach(function (b) {
          b.classList.toggle('is-active', b.textContent === city);
        });
      }
    }

    function animateValue(el, from, to, duration) {
      var start = null;
      function frame(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (to - from) * eased).toLocaleString('en-US');
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    dots.forEach(function (dot) {
      var city = dot.getAttribute('data-city');
      dot.addEventListener('mouseenter', function () { setActive(city, true); });
      dot.addEventListener('focus', function () { setActive(city, true); });
      dot.addEventListener('click', function () { setActive(city, true); });
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActive(city, true);
        }
      });
    });

    // mobile chips
    if (chipsWrap) {
      Object.keys(CITY_DATA).forEach(function (city) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.textContent = city;
        chip.addEventListener('click', function () { setActive(city, true); });
        chipsWrap.appendChild(chip);
      });
    }

    // markets hub: dots link to city pages
    var mapNav = document.querySelector('.map-wrap[data-nav]');
    if (mapNav) {
      dots.forEach(function (dot) {
        var href = dot.getAttribute('data-href');
        if (!href) return;
        dot.addEventListener('click', function () { window.location.href = href; });
        dot.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') window.location.href = href;
        });
      });
    }

    setActive('Tampa', false);
  })();

  /* ------------------------------------------------------------------
     7. Forms — honeypot check + redirect to thank-you
        (connect a real form service by removing data-redirect and
         pointing the form action at your endpoint)
  ------------------------------------------------------------------ */
  (function siteForms() {
    function depthPrefix() {
      var slashes = (window.location.pathname.match(/\//g) || []).length;
      return slashes > 1 ? '../' : '';
    }
    document.querySelectorAll('form[data-redirect]').forEach(function (form) {
      if (form.hasAttribute('data-netlify')) return; // Netlify Forms: native POST + action redirect
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var trap = form.querySelector('input[name="company_website"]');
        if (trap && trap.value) return; // bot: silently drop
        if (!form.checkValidity()) { form.reportValidity(); return; }
        window.location.href = depthPrefix() + 'thank-you.html';
      });
    });
  })();

  /* ------------------------------------------------------------------
     9b. Blog: category filter + newsletter
  ------------------------------------------------------------------ */
  (function blogFilter() {
    var wrap = document.getElementById('cat-filter');
    if (!wrap) return;
    var cards = document.querySelectorAll('#blog-cards [data-cat]');
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-cat]');
      if (!btn) return;
      wrap.querySelectorAll('button').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var cat = btn.getAttribute('data-cat');
      cards.forEach(function (c) {
        c.classList.toggle('is-hidden', cat !== 'all' && c.getAttribute('data-cat') !== cat);
      });
    });
  })();

  (function newsletter() {
    var form = document.getElementById('news-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.innerHTML = '<span style="display:inline-flex;align-items:center;gap:9px;font-weight:600;color:#B5CC2E">' +
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
        'You\u2019re in \u2014 first Brief lands next month.</span>';
    });
  })();


  /* ------------------------------------------------------------------
     11. Active nav state
  ------------------------------------------------------------------ */
  (function activeNav() {
    var path = window.location.pathname.replace(/\/index\.html$/, '/');
    if (!path.endsWith('/')) path = path.replace(/\.html$/, '');
    var here = path.split('/').filter(Boolean).pop() || '';
    var prefix = (window.location.pathname.match(/\//g) || []).length > 1 ? '../' : '';
    document.querySelectorAll('.nav__menu .nav__link').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href === '#' ) return;
      var clean = href.replace(prefix, '').replace('index.html', '').replace('.html', '').replace(/\/$/, '');
      var key = clean.split('/').filter(Boolean).pop() || 'home';
      var pageKey = here || 'home';
      if (key === pageKey) a.classList.add('is-active');
    });
  })();

  /* ------------------------------------------------------------------
     8. Ensure anchor links land below the sticky header
  ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 86;
      window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });
/* ------------------------------------------------------------------
     9. Case studies hub filter
  ------------------------------------------------------------------ */
  (function caseFilter() {
    var gridTop = document.getElementById('cs-grid');
    var gridBottom = document.getElementById('cs-grid-bottom');
    var citySel = document.getElementById('cs-city');
    var svcSel = document.getElementById('cs-service');
    var countEl = document.getElementById('cs-count');
    if (!gridTop || !citySel || !svcSel) return;

    function applyFilter() {
      var city = citySel.value;
      var svc = svcSel.value;
      var shown = 0;
      var cards = document.querySelectorAll('#cs-grid .cscard, #cs-grid-bottom .cscard');
      cards.forEach(function (card) {
        var okCity = city === 'all' || card.getAttribute('data-city') === city;
        var svcs = (card.getAttribute('data-services') || '').split(',');
        var okSvc = svc === 'all' || svcs.indexOf(svc) !== -1;
        var show = okCity && okSvc;
        card.classList.toggle('is-hidden', !show);
        if (show) shown++;
      });
      if (countEl) countEl.innerHTML = '<b>' + shown + '</b> case studies';
    }
    citySel.addEventListener('change', applyFilter);
    svcSel.addEventListener('change', applyFilter);
    applyFilter();
  })();

  /* ------------------------------------------------------------------
     10. Pricing ROI calculator
  ------------------------------------------------------------------ */
  (function roiCalc() {
    var wrap = document.getElementById('roi-calc');
    if (!wrap) return;
    var planSel = document.getElementById('roi-plan');
    var commIn = document.getElementById('roi-comm');
    var leadsIn = document.getElementById('roi-leads');
    var dealsEl = document.getElementById('roi-deals');
    var monthsEl = document.getElementById('roi-months');
    var lineEl = document.getElementById('roi-line');
    var planNames = { '997': 'Local Starter', '1997': 'Market Leader', '3497': 'Luxury & Multi-City' };

    function fmt(n) { return n.toLocaleString('en-US'); }
    function calc() {
      var price = parseFloat(planSel.value) || 997;
      var comm = parseFloat(commIn.value) || 0;
      var plan = planNames[String(price)] || 'this plan';
      if (comm < 500) {
        dealsEl.textContent = '\u2014';
        monthsEl.textContent = '0.0';
        lineEl.textContent = 'Enter your average commission to see the math.';
        return;
      }
      var ratio = comm / price;
      var months = Math.round(ratio * 10) / 10;
      dealsEl.textContent = '1';
      monthsEl.textContent = months.toFixed(1);
      lineEl.textContent = 'At $' + fmt(comm) + ' per closing, one extra deal covers ' +
        (months >= 1 ? 'roughly ' + months.toFixed(1) + ' months' : 'part of a month') + ' of ' + plan + '.';
    }
    [planSel, commIn, leadsIn].forEach(function (el) {
      el.addEventListener('input', calc);
      el.addEventListener('change', calc);
    });
    calc();
  })();

})();
