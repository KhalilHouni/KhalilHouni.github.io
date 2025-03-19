document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('.carousel__container');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const currentPageSpan = document.querySelector('.current-page');
    const totalPagesSpan = document.querySelector('.total-pages');
    let currentIndex = 0;
  
    function showContainer(index) {
      // First, hide all containers with a fade out
      containers.forEach(container => {
        container.style.opacity = '0';
        setTimeout(() => {
          container.style.display = 'none';
        }, 300);
      });
  
      // Then show the selected container with a fade in
      setTimeout(() => {
        containers[index].style.display = 'grid';
        setTimeout(() => {
          containers[index].style.opacity = '1';
        }, 50);
      }, 300);
  
      currentIndex = index;
      currentPageSpan.textContent = currentIndex + 1;
      
      // Update button states
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === containers.length - 1;
    }
  
    function nextSlide() {
      if (currentIndex < containers.length - 1) {
        showContainer(currentIndex + 1);
      }
    }
  
    function prevSlide() {
      if (currentIndex > 0) {
        showContainer(currentIndex - 1);
      }
    }
  
    // Initialize carousel
    if (containers.length > 0) {
      totalPagesSpan.textContent = containers.length;
      showContainer(0);
    }
  
    // Event listeners
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);
  
    // Ajouter l'index aux tags pour l'animation en vague
    document.querySelectorAll('.projects__tags span').forEach((tag, index) => {
      tag.style.setProperty('--tag-index', index);
    });
  });
  