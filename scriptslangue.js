document.addEventListener('DOMContentLoaded', () => {
  const languageToggle = document.getElementById('language-toggle');
  const elementsToTranslate = document.querySelectorAll('[data-lang]');
  let translations = {};
  let currentLanguage = 'fr'; // Par défaut, la langue est le français

  // Fonction pour charger les traductions depuis le fichier JSON
  const loadTranslations = () => {
    return fetch('translations.json')
      .then(response => response.json())
      .then(data => {
        translations = data;
        updateLanguage(currentLanguage); // Initialisation du contenu avec la langue par défaut
      })
      .catch(error => console.error('Error loading translations:', error));
  };

  // Fonction pour mettre à jour le contenu des éléments avec l'attribut data-lang
  const updateLanguage = (lang) => {
    currentLanguage = lang;
    elementsToTranslate.forEach((element) => {
      const key = element.getAttribute('data-lang');
      element.innerHTML = translations[lang][key];
    });
    languageToggle.textContent = lang.toUpperCase();
  };

  // Event pour le clic sur le bouton de bascule de langue
  languageToggle.addEventListener('click', (e) => {
let newLanguage;
switch(currentLanguage) {
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
newLanguage = 'fr'; // Par défaut, basculer vers le français
}
updateLanguage(newLanguage);
});


  // Ajouter des événements aux boutons dans le dropdown
  document.querySelectorAll('.header__language-dropdown button').forEach(button => {
    button.addEventListener('click', (e) => {
      const newLanguage = e.target.getAttribute('data-lang');
      updateLanguage(newLanguage);
    });
  });

  // Charger les traductions au chargement de la page
  loadTranslations();
});