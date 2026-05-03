
/**
 * Carousel Logic (Reverted)
 * Simple show/hide matching the original behavior.
 */
document.addEventListener("DOMContentLoaded", function () {
  const containers = document.querySelectorAll(".carousel__container");
  const prevButton = document.querySelector(".prev-button");
  const nextButton = document.querySelector(".next-button");
  const currentPageSpan = document.querySelector(".current-page");
  const totalPagesSpan = document.querySelector(".total-pages");
  let currentIndex = 0;

  if (containers.length === 0) return;

  function showContainer(index) {
    containers.forEach((container, i) => {
      if (i === index) {
        container.style.display = "grid";
        container.classList.add("active");
      } else {
        container.style.display = "none";
        container.classList.remove("active");
      }
    });

    currentIndex = index;
    currentPageSpan.textContent = currentIndex + 1;
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === containers.length - 1;
  }

  nextButton?.addEventListener("click", () => {
    if (currentIndex < containers.length - 1) showContainer(currentIndex + 1);
  });

  prevButton?.addEventListener("click", () => {
    if (currentIndex > 0) showContainer(currentIndex - 1);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" && !nextButton.disabled) nextButton.click();
    if (e.key === "ArrowLeft" && !prevButton.disabled) prevButton.click();
  });

  totalPagesSpan.textContent = containers.length;
  showContainer(0);
});

