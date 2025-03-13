// Language Switcher Logic
const langEls = document.querySelectorAll('[data-lang]');
const langFlags = document.querySelectorAll('.language-switcher img');

function switchLanguage(lang) {
  langEls.forEach(el => {
    if (el.getAttribute('data-lang') === lang) {
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  });
  localStorage.setItem('selectedLang', lang);
}

// Load saved language or default to Greek
const savedLang = localStorage.getItem('selectedLang') || 'el';
switchLanguage(savedLang);

// Add event listeners to flags
langFlags.forEach(flag => {
  flag.addEventListener('click', () => {
    const selectedLang = flag.id.replace('lang-', '');
    switchLanguage(selectedLang);
  });
});

// Carousel Logic
let currentIndex = 0;
const carouselItems = document.querySelectorAll('.carousel-item');
const totalItems = carouselItems.length;

function showNextImage() {
  if (carouselItems.length > 0) {
    carouselItems[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % totalItems;
    carouselItems[currentIndex].classList.add('active');
  }
}

setInterval(showNextImage, 5000);
