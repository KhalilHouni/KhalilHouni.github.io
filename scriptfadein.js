
document.addEventListener('scroll', function() {
  var skillsSection = document.querySelector('.skills');
  var skillsSectionPosition = skillsSection.getBoundingClientRect().top;
  var windowHeight = window.innerHeight;

  if (skillsSectionPosition < windowHeight / 1.2) {
    skillsSection.classList.add('fade-in');
  }
});



document.addEventListener('scroll', function() {
    var skillsSection = document.querySelector('.projects');
    var skillsSectionPosition = skillsSection.getBoundingClientRect().top;
    var windowHeight = window.innerHeight;
  
    if (skillsSectionPosition < windowHeight / 1.2) {
      skillsSection.classList.add('fade-in');
    }
  });
  
  
  document.addEventListener('scroll', function() {
    var skillsSection = document.querySelector('.contact');
    var skillsSectionPosition = skillsSection.getBoundingClientRect().top;
    var windowHeight = window.innerHeight;
  
    if (skillsSectionPosition < windowHeight / 1.2) {
      skillsSection.classList.add('fade-in');
    }
  });
  

