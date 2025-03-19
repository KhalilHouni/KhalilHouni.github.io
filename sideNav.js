document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.side-nav__link'); // Correction du sélecteur

  function updateActiveLink() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const screenMiddle = scrollY + (windowHeight / 2);

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      // Vérifie si la section est visible dans la fenêtre
      if (screenMiddle >= sectionTop && screenMiddle <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Gestion spéciale pour la section Home
    if (scrollY < 100) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#top') {
          link.classList.add('active');
        }
      });
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#top') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      if (targetId === '#skills') {
        const apprenticeshipText = document.querySelector('[data-lang="hero-apprenticeship"]');
        window.scrollTo({
          top: apprenticeshipText.getBoundingClientRect().top + window.pageYOffset - 35,
          behavior: 'smooth'
        });
      } else if (targetId === '#projects') {
        const projectsHeadline = document.querySelector('.projects__headline');
        window.scrollTo({
          top: projectsHeadline.getBoundingClientRect().top + window.pageYOffset - 8,
          behavior: 'smooth'
        });
      } else {
        const targetSection = document.querySelector(targetId);
        window.scrollTo({
          top: targetSection.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
});
