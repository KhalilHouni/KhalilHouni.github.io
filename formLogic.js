
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact__form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span>Sending...</span>';
    submitButton.disabled = true;

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Submit silently in background, stay on page
    const formId = "1FAIpQLSdCzw5-wZK7QtfhrnWwM7lnbBoBTbvD5yljJI_gvkguceaO-w";
    const submitUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
    const body = new URLSearchParams({
      "entry.1389859628": name,
      "entry.905111126": email,
      "entry.1225568181": message,
    });

    fetch(submitUrl, { method: "POST", mode: "no-cors", body })
      .finally(() => {
        form.innerHTML = `
          <div class="contact__success">
            <p>Thanks ${name}! Your message has been sent.</p>
            <p>I'll get back to you at ${email} as soon as possible.</p>
          </div>`;
        launchConfetti();
      });
  });

  function launchConfetti() {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:99999;";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#7314f0", "#a855f7", "#c084fc", "#e9d5ff", "#ffffff", "#4ade80", "#fbbf24", "#f97316"];
    const particles = Array.from({ length: 130 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 120,
      w: 7 + Math.random() * 7,
      h: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 7,
      vy: 2 + Math.random() * 4,
      va: (Math.random() - 0.5) * 0.18,
      opacity: 1,
    }));

    let frame = 0;
    const total = 200;

    (function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.va;
        p.vy += 0.12;
        if (frame > total * 0.55) p.opacity = Math.max(0, p.opacity - 0.018);
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (++frame < total) requestAnimationFrame(animate);
      else canvas.remove();
    })();
  }
});
