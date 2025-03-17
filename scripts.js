// ✅ Ensure Carousel Works on All Sections
const carouselImages = ['images/1.jpg', 'images/2.jpg', 'images/3.jpg'];
let currentIndex = 0;

function changeCarousel() {
  currentIndex = (currentIndex + 1) % carouselImages.length;
  document.querySelectorAll('.content-section, .carousel').forEach(section => {
    section.style.backgroundImage = `url(${carouselImages[currentIndex]})`;
  });
}

setInterval(changeCarousel, 5000); // Change image every 5 seconds

// ✅ Language switching logic
function switchLanguage(lang) {
  document.querySelectorAll('[data-lang-el], [data-lang-en], [data-lang-fr], [data-lang-nl], [data-lang-he], [data-lang-de]').forEach(el => {
    const text = el.getAttribute(`data-lang-${lang}`);
    if (text) el.textContent = text;
  });

  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = (el.getAttribute('data-lang') === lang) ? '' : 'none';
  });

  localStorage.setItem('selectedLang', lang);
}

// ✅ Language switch event listeners
document.querySelectorAll('.language-switcher img').forEach(flag => {
  flag.addEventListener('click', () => switchLanguage(flag.id));
});

// Load saved language or default to Greek
const savedLang = localStorage.getItem('selectedLang') || 'el';
switchLanguage(savedLang);

// ✅ Smooth animation for sections
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('section').forEach(section => observer.observe(section));

// Simple caching mechanism
const cacheName = 'lotos-cafe-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/scripts.js',
  '/images/1.jpg',
  '/images/2.jpg',
  '/images/3.jpg'
];

// Cache assets on page load
window.addEventListener('load', () => {
  caches.open(cacheName).then(cache => {
    cache.addAll(assetsToCache);
  });
});

// Serve cached assets if available
window.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});