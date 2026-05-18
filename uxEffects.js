
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

  // 2. Parallax Effects + Scroll Progress + Back to Top
  const progressBar = document.getElementById("scrollProgressBar");
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;

    // Parallax
    parallaxElements.forEach(el => {
      el.style.transform = `translateY(${scrolled * 0.2}px)`;
    });

    // Scroll progress bar
    if (progressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (scrolled / docHeight * 100) + "%";
    }

    // Back to top visibility
    if (backToTop) {
      if (scrolled > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }
  });

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Accent color picker
  const swatches = document.querySelectorAll(".color-swatch");
  const root = document.documentElement;

  function applyAccent(hsl, rgb) {
    root.style.setProperty("--accent", `hsl(${hsl})`);
    root.style.setProperty("--accent-rgb", rgb);
    localStorage.setItem("accent-hsl", hsl);
    localStorage.setItem("accent-rgb", rgb);
    swatches.forEach(s => s.classList.toggle("active", s.dataset.accent === hsl));
  }

  const savedHsl = localStorage.getItem("accent-hsl");
  const savedRgb = localStorage.getItem("accent-rgb");
  if (savedHsl && savedRgb) {
    applyAccent(savedHsl, savedRgb);
  } else {
    const defaultSwatch = document.querySelector('.color-swatch[data-accent="266,88%,51%"]');
    if (defaultSwatch) defaultSwatch.classList.add("active");
  }

  swatches.forEach(s => {
    s.addEventListener("click", () => applyAccent(s.dataset.accent, s.dataset.rgb));
  });

  // Image blur-up
  document.querySelectorAll(".project-image, .featured-project__image").forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("loaded"));
    }
  });

  // Navi fairy hints
  const navi      = document.getElementById("navi");
  const naviBubble = navi && navi.querySelector(".navi__bubble");

  if (navi && naviBubble) {
    const msgs = [
      "Hey! Listen!   ...Sorry, force of habit.",
      "Did you know there are secrets hidden in this portfolio? Of course you didn't. That's why they're secrets.",
      "Are you the type to try the Konami code everywhere you can? Because… you should.",
      "Do you know who should follow the white rabbit? No? Me neither.",
      "I'm not saying there's a secret ocarina on this page. I'm just… not NOT saying it.",
      "Some say music can change the world. Or at least… the color scheme.",
      "You haven't left yet? Good. Khalil worked really hard on this.",
      "If you're a recruiter, Khalil would like a word with you. Just click Contact. It's right there.",
      "Between you and me, he spent WAY too long on the confetti animation. Please fill the form. Make it worth it.",
      "Hey! Listen! Have you tried clicking something that seemed unclickable?",
      "The Great Deku Tree once told me: 'Pay attention to the details.' He was very wise. And very old.",
      "↑↑↓↓←→←→BA. I learned that from a Gerudo warrior. True story.",
      "I've been flying around this page for a while now. Have YOU actually explored it?",
      "Did you try dark mode? Light hurts my eyes. I'm a fairy, it's a whole thing.",
      "Three hints so far. Are you even trying?",
      "In Hyrule we didn't have portfolios. Just dungeons. Honestly, this is better.",
      "The answer is almost always: try clicking it.",
      "Hey! Lis— okay I'll stop. But seriously. Secrets. This page. Look around.",
    ];
    let idx = 0;

    function showNavi() {
      naviBubble.textContent = msgs[idx % msgs.length];
      idx++;
      navi.classList.add("navi--show");
      setTimeout(() => navi.classList.remove("navi--show"), 7000);
    }

    setTimeout(showNavi, 900000);                      // first hint after 15 minutes
    let naviInterval = setInterval(showNavi, 600000);  // then every 10 minutes

    // Called by easterEgg.js after Saria's Song to make Navi appear much more often
    window.naviBoost = function () {
      clearInterval(naviInterval);
      naviInterval = setInterval(showNavi, 60000);     // every 1 minute
    };
  }
});

