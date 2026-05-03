
/**
 * Dark Mode Management
 * Handles theme toggle with a smooth Solar Transition effect.
 */

function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    htmlElement.classList.add("dark-mode");
  } else {
    htmlElement.classList.remove("dark-mode");
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", (e) => {
      const toggleTheme = () => {
        const isDark = htmlElement.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
      };

      if (!document.startViewTransition) {
        toggleTheme();
        return;
      }

      const x = e.clientX;
      const y = e.clientY;
      const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
      );

      const transition = document.startViewTransition(toggleTheme);

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 600,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    });
  }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      htmlElement.classList.toggle("dark-mode", e.matches);
    }
  });
}

document.addEventListener("DOMContentLoaded", initDarkMode);

