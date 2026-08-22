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

    setActive('Tampa', false);
  })();

  /* ------------------------------------------------------------------
     7. Audit form (static site — demo submit)
  ------------------------------------------------------------------ */
  (function auditForm() {
    var form = document.getElementById('audit-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var name = (document.getElementById('f-name').value || '').trim().split(' ')[0] || 'there';
      var wrap = form.closest('.audit__form-wrap');
      wrap.innerHTML =
        '<div class="form-success" role="status">' +
          '<div class="big"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>' +
          '<h3>Thanks, ' + escapeHtml(name) + ' — request received.</h3>' +
          '<p>Your free Florida SEO audit will land in your inbox within 24 hours. We\u2019ll follow up by phone if we spot something urgent.</p>' +
        '</div>';
    });
    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
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

})();
