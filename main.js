// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('#nav-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true' || false;
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.dataset.collapsed = expanded ? 'true' : 'false';
  });
}

// Dropdown toggle (supports nested dropdowns)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.dropdown > button');
  if (btn) {
    e.preventDefault();
    e.stopPropagation();
    const dropdown = btn.parentElement;
    const isOpen = dropdown.getAttribute('data-open') === 'true';
    
    // Close sibling dropdowns at the same level
    const parent = dropdown.parentElement;
    if (parent) {
      parent.querySelectorAll(':scope > .dropdown').forEach(d => {
        if (d !== dropdown) {
          d.setAttribute('data-open', 'false');
          const b = d.querySelector(':scope > button');
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      });
    }
    
    // Toggle current dropdown
    dropdown.setAttribute('data-open', !isOpen ? 'true' : 'false');
    btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
  } else {
    // Close all dropdowns when clicking outside
    document.querySelectorAll('.dropdown').forEach(d => {
      d.setAttribute('data-open', 'false');
      const b = d.querySelector(':scope > button');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
});

// Sticky nav shadow on scroll
const nav = document.querySelector('.nav');
let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  if (y > 8 && !nav.classList.contains('scrolled')) nav.classList.add('scrolled');
  if (y <= 8 && nav.classList.contains('scrolled')) nav.classList.remove('scrolled');
  lastY = y;
});

// Smooth internal anchor scrolling (for #pipeline/#roadmap)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1 && document.querySelector(id)) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu after selection
      if (menu && getComputedStyle(toggle).display !== 'none') {
        menu.dataset.collapsed = 'true';
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Ensure 'Investor Options' link appears in all nav bars (adds relative path automatically)
function ensureInvestorOptionsLink(){
  // compute path prefix to root based on current pathname
  const segs = location.pathname.replace(/^\//, '').split('/').filter(Boolean);
  const prefix = segs.length > 1 ? '../'.repeat(segs.length - 1) : '';
  const href = prefix + 'investor-options.html';

  document.querySelectorAll('nav').forEach(nav => {
    // skip if link already present
    if (nav.querySelector(`a[href="$${href}"]`) || nav.querySelector('a[href$="investor-options.html"]')) return;

    const a = document.createElement('a');
    a.href = href;
    a.textContent = 'Investor Options';
    // try to match styling conventions used in navs
    if (nav.classList.contains('nav')) a.className = 'nav__link';
    // insert before Contact link if present, else append at end
    const contact = nav.querySelector('a[href$="contact.html"]');
    if (contact) contact.parentNode.insertBefore(a, contact);
    else nav.appendChild(a);
  });
}

document.addEventListener('DOMContentLoaded', ensureInvestorOptionsLink);
