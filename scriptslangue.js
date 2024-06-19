document.addEventListener('DOMContentLoaded', () => {
  const languageToggle = document.getElementById('language-toggle');
  const elementsToTranslate = document.querySelectorAll('[data-lang]');
  let translations = {};
  // Default to 'fr' if no language is stored
  let currentLanguage = localStorage.getItem('preferredLanguage') || 'fr';
  // Function to load translations from JSON file
  const loadTranslations = () => {
    return fetch('translations.json')
      .then(response => response.json())
      .then(data => {
        translations = data;
        updateLanguage(currentLanguage); // Initialize content with the preferred language
      })
      .catch(error => console.error('Error loading translations:', error));
  };

  // Function to update elements with data-lang attribute based on selected language
  const updateLanguage = (lang) => {
    currentLanguage = lang;
    elementsToTranslate.forEach((element) => {
      const key = element.getAttribute('data-lang');
      element.innerHTML = translations[lang][key];
    });
    languageToggle.textContent = lang.toUpperCase();
    localStorage.setItem('preferredLanguage', lang); // Store selected language in localStorage
  };

  // Event listener for language toggle button click
  languageToggle.addEventListener('click', () => {
    let newLanguage;
    switch (currentLanguage) {
      case 'fr':
        newLanguage = 'en';
        break;
      case 'en':
        newLanguage = 'es';
        break;
      case 'es':
        newLanguage = 'fr';
        break;
      default:
        newLanguage = 'fr'; // Default to French if current language is unknown
    }
    updateLanguage(newLanguage);
  });

  // Add click event listeners to buttons in the language dropdown
  document.querySelectorAll('.header__language-dropdown button').forEach(button => {
    button.addEventListener('click', (e) => {
      const newLanguage = e.target.getAttribute('data-lang');
      updateLanguage(newLanguage);
    });
  });

  // Load translations when the page is loaded
  loadTranslations();
});
