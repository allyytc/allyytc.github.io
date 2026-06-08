// Sticky nav shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('nav-scrolled', window.scrollY > 10);
});

// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const mobileLinks = document.getElementById('mobileLinks');
toggle.addEventListener('click', () => mobileLinks.classList.toggle('open'));
mobileLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileLinks.classList.remove('open'));
});

// Scroll-in fade animations
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08 }
);

document.querySelectorAll(
  '.exp-item, .project-item, .stat, .skills-group, .edu-item, .about-layout'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
