
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(hover: none)").matches) return;

  const dot = document.createElement("div");
  dot.id = "custom-cursor";
  document.body.appendChild(dot);

  let mouseX = -200, mouseY = -200;
  let scheduled = false;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => {
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        scheduled = false;
      });
    }
  });

  const INTERACTIVE = "a, button, input, textarea, select, label, [role='button'], .project-card, .skills__item, .ocarina-note, .synth-key, .color-swatch";

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(INTERACTIVE)) dot.classList.add("cursor--hover");
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(INTERACTIVE)) dot.classList.remove("cursor--hover");
  });

  document.addEventListener("mouseleave", () => dot.style.opacity = "0");
  document.addEventListener("mouseenter", () => dot.style.opacity = "1");
});
