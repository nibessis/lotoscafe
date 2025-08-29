// ✅ Home carousel
const carouselImages = ['images/1.jpg', 'images/2.jpg', 'images/3.jpg'];
let currentIndex = 0;

function changeCarousel() {
  currentIndex = (currentIndex + 1) % carouselImages.length;
  document.querySelectorAll('.carousel').forEach(section => {
    section.style.backgroundImage = `url(${carouselImages[currentIndex]})`;
  });
}

// Set initial background image on load for the carousel
document.querySelectorAll('.carousel').forEach(section => {
  section.style.backgroundImage = `url(${carouselImages[currentIndex]})`;
});

setInterval(changeCarousel, 20000); // Change image every 20 seconds

// ✅ Language switching logic
function switchLanguage(lang) {
  // Update all elements that have specific language attributes
  document.querySelectorAll('[data-lang-el], [data-lang-en], [data-lang-fr], [data-lang-nl], [data-lang-he], [data-lang-de]').forEach(el => {
    const text = el.getAttribute(`data-lang-${lang}`);
    if (text) el.textContent = text;
  });

  // For elements with generic data-lang (used in menu categories) show only the selected language
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = (el.getAttribute('data-lang') === lang) ? '' : 'none';
  });

  localStorage.setItem('selectedLang', lang);
}

// ✅ Language switch event listeners
document.querySelectorAll('.language-switcher img').forEach(flag => {
  flag.addEventListener('click', () => switchLanguage(flag.id));
});

// ✅ Initial language: use saved one; otherwise auto-detect once
(function initLanguage() {
  const supported = ['el','en','fr','nl','he','de'];
  const saved = localStorage.getItem('selectedLang');
  const auto = (navigator.language || navigator.userLanguage || 'en').toLowerCase().split('-')[0];
  const lang = saved || (supported.includes(auto) ? auto : 'en');
  switchLanguage(lang);
})();

// ✅ Smooth animation for content sections
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.content-section').forEach(section => observer.observe(section));

// ✅ Ensure deep-linked section (e.g., #menu from QR) is revealed immediately
function revealSectionFromHash() {
  const { hash } = location;
  if (!hash) return;
  const el = document.querySelector(hash);
  if (el && el.classList && el.classList.contains('content-section')) {
    el.classList.add('visible'); // forces it to fade in even if observer is late
  }
}
window.addEventListener('hashchange', revealSectionFromHash);
document.addEventListener('DOMContentLoaded', revealSectionFromHash);

// ✅ Register service worker (mobile-friendly updates)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js?v=20250808', { updateViaCache: 'none' })
    .then(registration => {
      // Ask for an update on load
      registration.update();

      // If a new worker takes control, reload once to get fresh HTML/assets
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}

