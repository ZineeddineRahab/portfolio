/* =============================================
   PORTFOLIO — script.js
   Author: Zine Eddine Rahab
============================================= */

/* ---------- Navbar: scroll behaviour ---------- */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

/* ---------- Hamburger / Mobile Menu ---------- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close mobile nav when a link is clicked
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* ---------- Active Nav Link on Scroll ---------- */
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a[data-section]');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinkEls.forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
  });
}

/* ---------- Scroll Reveal (IntersectionObserver) ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Contact Form Validation + Toast ---------- */
const contactForm = document.getElementById('contact-form');
const toast       = document.getElementById('toast');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('f-name').value.trim();
  const email   = document.getElementById('f-email').value.trim();
  const message = document.getElementById('f-message').value.trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message) {
    showToast('⚠️', 'Please fill in all fields.', '#f59e0b');
    return;
  }
  if (!emailRx.test(email)) {
    showToast('⚠️', 'Please enter a valid email address.', '#f59e0b');
    return;
  }

  // Build mailto
  const subject  = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body     = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:zineeddine.ra@gmail.com?subject=${subject}&body=${body}`;

  contactForm.reset();
  showToast('✅', 'Message ready! Your email client should open.', '#22c55e');
});

function showToast(icon, msg, color) {
  toast.querySelector('.toast-icon').textContent = icon;
  toast.querySelector('.toast-text').textContent  = msg;
  toast.style.borderColor = color + '55';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ---------- Smooth stat counter animation ---------- */
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start) + (el.dataset.suffix || '');
  }, 16);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num[data-target]').forEach(num => {
        animateCounter(num, parseInt(num.dataset.target));
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ---------- Current year in footer ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
