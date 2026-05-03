
/**
 * Side Navigation Logic
 * Handles scroll spy and smooth navigation.
 */
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".side-nav__link");

  /**
   * Updates active state of nav links based on scroll position
   */
  function updateActiveLink() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const screenMiddle = scrollY + windowHeight / 2;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (screenMiddle >= sectionTop && screenMiddle <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${sectionId}`);
        });
      }
    });

    if (scrollY < 100) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#top");
      });
    }
  }

  // Smooth scroll with offsets
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = targetId === "#top" ? document.body : document.querySelector(targetId);

      if (targetElement) {
        const offset = 80; // General offset for header
        const targetPosition = targetId === "#top" ? 0 : targetElement.offsetTop - offset;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Throttled scroll listener
  let isScrolling;
  window.addEventListener("scroll", () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(updateActiveLink, 50);
  }, false);

  updateActiveLink();
});

