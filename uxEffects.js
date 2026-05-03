
/**
 * Advanced UX Effects
 * Magnetic Skills and Parallax.
 */

document.addEventListener("DOMContentLoaded", () => {
  const skills = document.querySelectorAll(".skills__item");
  const parallaxElements = document.querySelectorAll(".hero__rings, .skills__rings");

  // 1. Magnetic Skills
  skills.forEach(skill => {
    skill.addEventListener("mousemove", (e) => {
      const rect = skill.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Stronger magnetism: 40% of mouse distance from center
      skill.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
      skill.style.zIndex = "10";
    });

    skill.addEventListener("mouseleave", () => {
      skill.style.transform = "translate(0, 0)";
      skill.style.zIndex = "1";
    });
  });

  // 2. Parallax Effects
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    parallaxElements.forEach(el => {
      const speed = 0.2;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
});

