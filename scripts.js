// Language switching logic
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

// Language switch event listeners
document.querySelectorAll('.language-switcher img').forEach(flag => {
  flag.addEventListener('click', () => switchLanguage(flag.id));
});

// Load saved language or default to Greek
const savedLang = localStorage.getItem('selectedLang') || 'el';
switchLanguage(savedLang);

// Accordion functionality
document.querySelectorAll('.accordion').forEach(acc => {
  acc.onclick = () => {
    const panel = acc.nextElementSibling;
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  };
});

// Smooth animation for sections
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('section').forEach(section => observer.observe(section));

// ✅ FIXED CAROUSEL FUNCTIONALITY
const carouselImages = ['images/1.jpg', 'images/2.jpg', 'images/3.jpg']; // Ensure these paths are correct
let currentIndex = 0;
const carousel = document.querySelector('.carousel');

function changeCarousel() {
  currentIndex = (currentIndex + 1) % carouselImages.length;
  carousel.style.backgroundImage = `url(${carouselImages[currentIndex]})`;
}

setInterval(changeCarousel, 5000); // Change image every 5 seconds

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
         console.log('Service Worker registered: ', registration);
      })
      .catch(registrationError => {
         console.log('Service Worker registration failed: ', registrationError);
      });
  });
}
