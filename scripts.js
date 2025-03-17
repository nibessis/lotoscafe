// ✅ Carousel functionality for the home section only
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

setInterval(changeCarousel, 5000); // Change image every 5 seconds

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

// Load saved language or default to Greek
const savedLang = localStorage.getItem('selectedLang') || 'el';
switchLanguage(savedLang);

// ✅ Smooth animation for content sections
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.content-section').forEach(section => observer.observe(section));

// ✅ Register service worker for caching assets
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}
