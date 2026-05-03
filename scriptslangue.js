
/**
 * Language Management
 * Handles multi-language support (EN, FR, ES) with persistence.
 */

document.addEventListener("DOMContentLoaded", () => {
  const languageToggle = document.getElementById("language-toggle");
  const elementsToTranslate = document.querySelectorAll("[data-lang]");
  const dropdownButtons = document.querySelectorAll(".header__language-dropdown button");
  
  let translations = {};
  let currentLanguage = localStorage.getItem("preferredLanguage") || "fr";

  /**
   * Updates page content based on selected language
   * @param {string} lang - The language code (en, fr, es)
   */
  const updateLanguage = (lang) => {
    if (!translations[lang]) return;
    
    currentLanguage = lang;
    elementsToTranslate.forEach((element) => {
      const key = element.getAttribute("data-lang");
      if (translations[lang][key]) {
        // Use innerHTML only if content contains tags (like <span> or <br>)
        if (translations[lang][key].includes("<")) {
          element.innerHTML = translations[lang][key];
        } else {
          element.textContent = translations[lang][key];
        }
      }
    });

    languageToggle.textContent = lang.toUpperCase();
    localStorage.setItem("preferredLanguage", lang);
    document.documentElement.lang = lang; // Accessibility
  };

  /**
   * Fetches translations and initializes the page
   */
  const loadTranslations = async () => {
    try {
      const response = await fetch("translations.json");
      if (!response.ok) throw new Error("Failed to load translations");
      translations = await response.json();
      updateLanguage(currentLanguage);
    } catch (error) {
      console.error("Error loading translations:", error);
    }
  };

  // Toggle button click (Cycles through languages)
  if (languageToggle) {
    languageToggle.addEventListener("click", () => {
      const languages = ["fr", "en", "es"];
      const nextIndex = (languages.indexOf(currentLanguage) + 1) % languages.length;
      updateLanguage(languages[nextIndex]);
    });
  }

  // Dropdown individual selection
  dropdownButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const newLanguage = e.target.getAttribute("data-lang");
      updateLanguage(newLanguage);
    });
  });

  loadTranslations();
});

