
/**
 * Carousel — swipe, dots, slide animation, keyboard hint
 */
document.addEventListener("DOMContentLoaded", function () {
  const carousel     = document.querySelector(".projects__carousel");
  const containers   = document.querySelectorAll(".carousel__container");
  const prevButton   = document.querySelector(".prev-button");
  const nextButton   = document.querySelector(".next-button");
  const indicators   = document.querySelector(".carousel-indicators");

  if (!carousel || containers.length === 0) return;

  let currentIndex = 0;
  let isAnimating  = false;

  // --- Dot indicators ---
  indicators.innerHTML = "";
  const dots = Array.from(containers, (_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Page ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    indicators.appendChild(dot);
    return dot;
  });

  // --- Keyboard hint ---
  const hint = document.createElement("span");
  hint.className = "carousel-keyboard-hint";
  hint.textContent = "← → keys";
  document.querySelector(".carousel-controls").appendChild(hint);

  // --- Core navigation ---
  function goTo(index) {
    if (isAnimating || index === currentIndex) return;
    if (index < 0 || index >= containers.length) return;
    isAnimating = true;

    const direction = index > currentIndex ? "right" : "left";
    const outgoing  = containers[currentIndex];
    const incoming  = containers[index];

    outgoing.style.display = "none";
    outgoing.classList.remove("active");

    incoming.style.display = "grid";
    incoming.classList.add("active", `carousel-slide-in-${direction}`);

    currentIndex = index;
    updateUI();

    setTimeout(() => {
      incoming.classList.remove(`carousel-slide-in-${direction}`);
      isAnimating = false;
    }, 420);
  }

  function updateUI() {
    dots.forEach((dot, i) => dot.classList.toggle("active", i === currentIndex));
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === containers.length - 1;
  }

  // --- Buttons ---
  nextButton?.addEventListener("click", () => goTo(currentIndex + 1));
  prevButton?.addEventListener("click", () => goTo(currentIndex - 1));

  // --- Keyboard ---
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key === "ArrowRight") goTo(currentIndex + 1);
    if (e.key === "ArrowLeft")  goTo(currentIndex - 1);
  });

  // --- Touch swipe ---
  let touchStartX = 0;
  let touchStartY = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
      dx < 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
    }
  }, { passive: true });

  // --- Init ---
  containers.forEach((c, i) => { if (i !== 0) c.style.display = "none"; });
  containers[0].classList.add("active");
  updateUI();
});
