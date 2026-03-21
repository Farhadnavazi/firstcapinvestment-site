/* ═══════════════════════════════════════════════════════
   FCIR Redesign — JavaScript
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Header scroll state ---
  const header = document.getElementById('header');
  let lastScroll = 0;
  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    lastScroll = scrollY;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile burger menu ---
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');

  function toggleMobileNav() {
    const isOpen = burgerBtn.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  burgerBtn.addEventListener('click', toggleMobileNav);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        toggleMobileNav();
      }
    });
  });

  // --- Smooth scroll for all anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

/* --- Lead Capture Modal --- */
function openValuationForm() {
  const modal = document.getElementById('valuationModal');
  const form = document.getElementById('valuationForm');
  const success = document.getElementById('formSuccess');
  if (form) form.style.display = 'block';
  if (success) success.style.display = 'none';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeValuationForm() {
  const modal = document.getElementById('valuationModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// --- Mailchimp Integration ---
var MC_URL = 'https://firstcapinvestment.us18.list-manage.com/subscribe/post-json?u=989ce2d8362861bfc6ffbc66e&id=ecf0b846f3&f_id=00a6b2e6f0';
var MC_HONEYPOT = 'b_989ce2d8362861bfc6ffbc66e_ecf0b846f3';

function sendToMailchimp(params, callback) {
  var cbName = 'mc_cb_' + Date.now();
  params += '&c=' + cbName;
  window[cbName] = function(data) {
    callback(data);
    delete window[cbName];
    document.getElementById('mc-jsonp-' + cbName)?.remove();
  };
  var s = document.createElement('script');
  s.id = 'mc-jsonp-' + cbName;
  s.src = MC_URL + '&' + params;
  document.body.appendChild(s);
}

function submitValuationForm(e) {
  e.preventDefault();
  var form = document.getElementById('valuationForm');
  var submitBtn = document.getElementById('submitBtn');
  var success = document.getElementById('formSuccess');
  var errorEl = document.getElementById('formError');

  var data = new FormData(form);
  var formObj = {};
  data.forEach(function(val, key) { formObj[key] = val; });

  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;
  if (errorEl) errorEl.style.display = 'none';

  // Build Mailchimp params
  var params = 'EMAIL=' + encodeURIComponent(formObj.email)
    + '&FNAME=' + encodeURIComponent(formObj.firstName)
    + '&LNAME=' + encodeURIComponent(formObj.lastName)
    + '&PHONE=' + encodeURIComponent(formObj.phone)
    + '&ADDRESS=' + encodeURIComponent(formObj.propertyAddress)
    + '&COMPANY=' + encodeURIComponent(
        'Valuation Request | Type: ' + formObj.propertyType
        + ' | Size: ' + (formObj.units || 'N/A')
        + ' | Timeline: ' + (formObj.timeline || 'N/A')
        + ' | Notes: ' + (formObj.notes || 'None')
      )
    + '&' + MC_HONEYPOT + '=';

  sendToMailchimp(params, function(resp) {
    submitBtn.textContent = 'Submit Request';
    submitBtn.disabled = false;
    if (resp.result === 'success' || (resp.msg && resp.msg.indexOf('already subscribed') > -1)) {
      form.style.display = 'none';
      success.style.display = 'block';
      form.reset();
    } else {
      if (errorEl) {
        errorEl.textContent = 'Something went wrong. Please try again or email us directly.';
        errorEl.style.display = 'block';
      }
    }
  });
}

// --- Footer Newsletter Subscribe ---
function submitFooterNewsletter(e) {
  e.preventDefault();
  var form = e.target;
  var emailInput = form.querySelector('input[type="email"]');
  var btn = form.querySelector('button');
  var msg = form.closest('.footer__col').querySelector('.footer__form-msg');
  var email = emailInput.value.trim();
  if (!email) return;

  btn.textContent = 'Subscribing...';
  btn.disabled = true;
  if (msg) { msg.textContent = ''; msg.className = 'footer__form-msg'; }

  var params = 'EMAIL=' + encodeURIComponent(email) + '&' + MC_HONEYPOT + '=';

  sendToMailchimp(params, function(resp) {
    btn.textContent = 'Subscribe';
    btn.disabled = false;
    if (resp.result === 'success') {
      if (msg) { msg.textContent = 'You\'re subscribed!'; msg.className = 'footer__form-msg footer__form-msg--success'; }
      emailInput.value = '';
    } else if (resp.msg && resp.msg.indexOf('already subscribed') > -1) {
      if (msg) { msg.textContent = 'You\'re already on our list!'; msg.className = 'footer__form-msg footer__form-msg--success'; }
      emailInput.value = '';
    } else {
      if (msg) { msg.textContent = 'Something went wrong. Please try again.'; msg.className = 'footer__form-msg footer__form-msg--error'; }
    }
  });
}

// --- Newsletter Subscribe ---
function submitNewsletter(e) {
  e.preventDefault();
  var form = e.target;
  var emailInput = form.querySelector('input[type="email"]');
  var btn = form.querySelector('button');
  var msg = form.querySelector('.newsletter__msg');
  var email = emailInput.value.trim();
  if (!email) return;

  btn.textContent = 'Subscribing...';
  btn.disabled = true;
  if (msg) { msg.textContent = ''; msg.className = 'newsletter__msg'; }

  var params = 'EMAIL=' + encodeURIComponent(email) + '&' + MC_HONEYPOT + '=';

  sendToMailchimp(params, function(resp) {
    btn.textContent = 'Subscribe';
    btn.disabled = false;
    if (resp.result === 'success') {
      if (msg) { msg.textContent = 'You\'re subscribed! We\'ll keep you updated on the LA market.'; msg.className = 'newsletter__msg newsletter__msg--success'; }
      emailInput.value = '';
    } else if (resp.msg && resp.msg.indexOf('already subscribed') > -1) {
      if (msg) { msg.textContent = 'You\'re already on our list!'; msg.className = 'newsletter__msg newsletter__msg--success'; }
      emailInput.value = '';
    } else {
      if (msg) { msg.textContent = 'Something went wrong. Please try again.'; msg.className = 'newsletter__msg newsletter__msg--error'; }
    }
  });
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeValuationForm();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeValuationForm();
  }
});

// --- Property Details Toggle ---
function togglePropertyDetails(id) {
  var panel = document.getElementById(id);
  var link = panel.previousElementSibling.querySelector('.property-card__link');
  if (panel.style.display === 'none' || panel.style.display === '') {
    panel.style.display = 'block';
    link.textContent = 'Hide Details \u2191';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    panel.style.display = 'none';
    link.textContent = 'View Details \u2192';
  }
}
