
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("intro-loader");
  if (!loader) return;
  if (document.documentElement.classList.contains("loader-skip")) return;

  sessionStorage.setItem("loader-shown", "1");

  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => loader.remove(), 650);
  }, 2400);
});
