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

function submitValuationForm(e) {
  e.preventDefault();
  const form = document.getElementById('valuationForm');
  const submitBtn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');

  // Collect form data
  const data = new FormData(form);
  const formObj = {};
  data.forEach((val, key) => { formObj[key] = val; });

  // Show loading state
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;

  // Send lead via email using mailto fallback
  // Build a mailto link as a simple lead delivery method
  const subject = encodeURIComponent('New Property Valuation Request - ' + formObj.propertyAddress);
  const body = encodeURIComponent(
    'New Valuation Request\n' +
    '=====================\n\n' +
    'Name: ' + formObj.firstName + ' ' + formObj.lastName + '\n' +
    'Email: ' + formObj.email + '\n' +
    'Phone: ' + formObj.phone + '\n' +
    'Property: ' + formObj.propertyAddress + '\n' +
    'Type: ' + formObj.propertyType + '\n' +
    'Size: ' + (formObj.units || 'Not specified') + '\n' +
    'Timeline: ' + (formObj.timeline || 'Not specified') + '\n' +
    'Notes: ' + (formObj.notes || 'None') + '\n'
  );

  // Open mailto in background
  const mailLink = document.createElement('a');
  mailLink.href = 'mailto:Farhad@FirstCapInvestment.com?subject=' + subject + '&body=' + body;
  mailLink.style.display = 'none';
  document.body.appendChild(mailLink);
  mailLink.click();
  document.body.removeChild(mailLink);

  // Show success state after brief delay
  setTimeout(function() {
    form.style.display = 'none';
    success.style.display = 'block';
    submitBtn.textContent = 'Submit Request';
    submitBtn.disabled = false;
    form.reset();
  }, 600);
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
