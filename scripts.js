// ✅ Home carousel
const carouselImages = ['images/1.jpg', 'images/2.jpg', 'images/3.jpg'];
let currentIndex = 0;
function changeCarousel() {
  currentIndex = (currentIndex + 1) % carouselImages.length;
  document.querySelectorAll('.carousel').forEach(section => {
    section.style.backgroundImage = `url(${carouselImages[currentIndex]})`;
  });
}
document.querySelectorAll('.carousel').forEach(section => {
  section.style.backgroundImage = `url(${carouselImages[currentIndex]})`;
});
setInterval(changeCarousel, 20000);

// ✅ FIX: Smooth scroll για navbar links
// Αντί για απλό href anchor, κάνουμε manual scroll ώστε να λειτουργεί
// και σε browsers που δεν τιμούν scroll-behavior:smooth για in-page anchors
document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    // Κάνε visible αν είναι content-section (για το animation)
    target.classList.add('visible');
    // offset = ύψος navbar, για #menu χρειαζόμαστε μόνο το navbar
    const offset = targetId === 'menu' ? 55 : 60;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    // Update hash χωρίς jump
    history.pushState(null, '', '#' + targetId);
  });
});

// ✅ Language switching logic
function switchLanguage(lang) {
  document.querySelectorAll('[data-lang-el], [data-lang-en], [data-lang-fr], [data-lang-nl], [data-lang-he], [data-lang-de]').forEach(el => {
    const text = el.getAttribute(`data-lang-${lang}`);
    if (text !== null) el.textContent = text;
  });
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = (el.getAttribute('data-lang') === lang) ? '' : 'none';
  });
  // RTL support για Εβραϊκά
  document.body.dir = (lang === 'he') ? 'rtl' : 'ltr';
  localStorage.setItem('selectedLang', lang);
}

document.querySelectorAll('.language-switcher img').forEach(flag => {
  flag.addEventListener('click', () => switchLanguage(flag.id));
});

(function initLanguage() {
  const supported = ['el','en','fr','nl','he','de'];
  const saved = localStorage.getItem('selectedLang');
  const auto = (navigator.language || navigator.userLanguage || 'en').toLowerCase().split('-')[0];
  const lang = saved || (supported.includes(auto) ? auto : 'en');
  switchLanguage(lang);
})();

// ✅ Smooth animation για content sections
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.content-section').forEach(section => observer.observe(section));

// ✅ Reveal section από hash (π.χ. QR code link)
function revealSectionFromHash() {
  const { hash } = location;
  if (!hash) return;
  const el = document.querySelector(hash);
  if (el) {
    el.classList.add('visible');
    setTimeout(() => {
      const offset = 60;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 100);
  }
}
window.addEventListener('hashchange', revealSectionFromHash);
document.addEventListener('DOMContentLoaded', revealSectionFromHash);

// ✅ Service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js?v=20250808', { updateViaCache: 'none' })
    .then(registration => {
      registration.update();
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
      console.log('Service Worker registered:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}
