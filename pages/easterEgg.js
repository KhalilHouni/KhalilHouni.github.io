/**
 * Ultimate Portfolio Easter Egg Suite v6.0 - THE DEFINITIVE EDITION
 * Full 3D Starfox Engine, All Ocarina Effects, and Stable Suite Integration.
 */

let clickCount = 0;
const CLICK_THRESHOLD = 7;
let ocarinaMode = false;
let noteSequence = [];
let keyboardEnabled = false;
let activeEffects = [];
let activeIntervals = [];

const SEQUENCES = {
  "Mi-Si-Re-Mi-Si-Re": "epona.mp3",
  "Fa-La-Fa-La-Re-Fa-Re-Fa": "fire.mp3",
  "La-Mi-Si-Re-Si-Re": "forest.mp3",
  "Mi-Re-Mi-Re-Si-Mi": "light.mp3",
  "Si-Mi-Re-Si-Mi-Re": "lullaby.mp3",
  "Fa-Re-Si-Fa-Re-Si": "saria.mp3",
  "Si-Re-Re-La-Si-Re-Fa": "shadow.mp3",
  "La-Fa-La-Re-Fa-La": "spirit.mp3",
  "La-Fa-Mi-La-Fa-Mi": "storm.mp3",
  "Re-Fa-Mi-Re-Fa-Mi": "sun.mp3",
  "Re-La-Fa-Re-La-Fa": "time.mp3",
  "La-Fa-Re-Re-Si": "water.mp3",
};

document.addEventListener("DOMContentLoaded", function () {
  const welcomeLink = document.querySelector(".header__home");
  const header = document.querySelector(".header__nav");
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffers = {};

  async function loadAudioFiles() {
    const notes = ["La", "Mi", "Re", "Si", "Fa"];
    for (const note of notes) {
      try {
        const response = await fetch(`./Others/Exos/notes/${note.toLowerCase()}.wav`);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffers[note] = await audioContext.decodeAudioData(arrayBuffer);
      } catch (error) { console.error(`Error loading ${note}.wav:`, error); }
    }
  }

  welcomeLink?.addEventListener("click", (e) => {
    e.preventDefault();
    clickCount++;
    if (clickCount >= CLICK_THRESHOLD && !ocarinaMode) {
      activateOcarinaMode();
      clickCount = 0;
    }
  });

  function activateOcarinaMode() {
    ocarinaMode = true;
    header.classList.add("ocarina-mode");
    const container = document.createElement("div");
    container.className = "ocarina-container";
    
    ["La", "Mi", "Re", "Si", "Fa"].forEach((note) => {
      const btnWrapper = document.createElement("div");
      btnWrapper.className = "ocarina-note-wrapper";
      btnWrapper.style.display = "inline-flex";
      btnWrapper.style.flexDirection = "column";
      btnWrapper.style.alignItems = "center";

      const btn = document.createElement("button");
      btn.className = "ocarina-note"; 
      btn.textContent = note;
      btn.setAttribute("data-note", note);
      btn.addEventListener("click", () => playNoteWithEffect(note));
      
      const hint = document.createElement("span");
      hint.className = "ocarina-hint";
      hint.style.fontSize = "10px"; hint.style.marginTop = "5px"; hint.style.color = "#fff"; hint.style.opacity = "0";
      
      const hints = { "La": "[A]", "Mi": "[↑]", "Fa": "[↓]", "Si": "[←]", "Re": "[→]" };
      hint.textContent = hints[note];

      btnWrapper.appendChild(btn);
      btnWrapper.appendChild(hint);
      container.appendChild(btnWrapper);
    });

    const close = document.createElement("button");
    close.textContent = "×"; close.className = "ocarina-close";
    close.addEventListener("click", deactivateOcarinaMode);
    header.prepend(container); header.appendChild(close);
  }

  function deactivateOcarinaMode() {
    ocarinaMode = false;
    keyboardEnabled = false;
    header.classList.remove("ocarina-mode");
    document.querySelector(".ocarina-container")?.remove();
    document.querySelector(".ocarina-close")?.remove();
    clearEffects();
  }

  function clearEffects() {
    activeEffects.forEach(el => el && el.remove ? el.remove() : null);
    activeIntervals.forEach(id => clearInterval(id));
    activeEffects = []; activeIntervals = [];
    document.body.classList.remove("matrix-mode", "mirror-mode", "vaporwave-mode", "physics-active", "xray-active", "arcade-mode", "awesome-3d-mode");
    stopAwesomeAnimation();
    document.removeEventListener("mousemove", handleAwesomeTilt);
    document.removeEventListener("mousemove", updateXRay);
    document.getElementById("xray-lens")?.remove();
    const main = document.getElementById("main"); if(main) main.style.transform = "";
  }

  function playNoteWithEffect(note) {
    const btn = document.querySelector(`.ocarina-note[data-note="${note}"]`);
    if (btn) {
      btn.classList.add("active");
      setTimeout(() => btn.classList.remove("active"), 200);
      spawnNoteParticle(note, btn);
    }
    playNote(note);
    checkSequence(note);
  }

  const NOTE_COLORS = { La: "#9333ea", Mi: "#22c55e", Re: "#f97316", Si: "#3b82f6", Fa: "#ef4444" };

  function spawnNoteParticle(note, btn) {
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
      const p = document.createElement("div");
      p.className = "note-particle";
      p.textContent = note;
      p.style.cssText = `left:${rect.left + rect.width / 2}px;top:${rect.top}px;color:${NOTE_COLORS[note]};--dx:${(Math.random() - 0.5) * 90}px;--dy:${-45 - Math.random() * 55}px;`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  }

  function playNote(note) {
    if (audioBuffers[note]) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffers[note]; source.connect(audioContext.destination); source.start(0);
    }
  }

  function checkSequence(note) {
    noteSequence.push(note);
    if (noteSequence.length > 8) noteSequence.shift();
    const currentStr = noteSequence.join("-");
    for (const [seq, song] of Object.entries(SEQUENCES)) {
      if (currentStr.endsWith(seq)) {
        playSuccess();
        setTimeout(() => triggerSongEffect(song), 2500);
        noteSequence = [];
        break;
      }
    }
  }

  function playSuccess() {
    const now = audioContext.currentTime;
    const notes = [{ freq: 783.99, time: 0 }, { freq: 987.77, time: 0.15 }, { freq: 1174.66, time: 0.3 }];
    notes.forEach(n => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain); gain.connect(audioContext.destination); osc.type = "sine";
      osc.frequency.setValueAtTime(n.freq, now + n.time);
      gain.gain.setValueAtTime(0, now + n.time);
      gain.gain.linearRampToValueAtTime(0.3, now + n.time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + n.time + 0.8);
      osc.start(now + n.time); osc.stop(now + n.time + 0.8);
    });
  }

  const SONG_META = {
    "storm.mp3":   { name: "Song of Storms",    color: "#60a5fa" },
    "fire.mp3":    { name: "Bolero of Fire",     color: "#f97316" },
    "time.mp3":    { name: "Song of Time",       color: "#818cf8" },
    "sun.mp3":     { name: "Sun's Song",         color: "#fbbf24" },
    "water.mp3":   { name: "Serenade of Water",  color: "#22d3ee" },
    "forest.mp3":  { name: "Minuet of Forest",   color: "#4ade80" },
    "epona.mp3":   { name: "Epona's Song",       color: "#d97706" },
    "lullaby.mp3": { name: "Zelda's Lullaby",    color: "#c084fc" },
    "saria.mp3":   { name: "Saria's Song",       color: "#86efac" },
    "light.mp3":   { name: "Prelude of Light",   color: "#fef08a" },
    "shadow.mp3":  { name: "Nocturne of Shadow", color: "#a855f7" },
    "spirit.mp3":  { name: "Requiem of Spirit",  color: "#fb923c" },
  };

  function showSongAnnouncement(songFile) {
    const info = SONG_META[songFile];
    if (!info) return;
    const existing = document.getElementById("song-announcement");
    if (existing) existing.remove();
    const el = document.createElement("div");
    el.id = "song-announcement";
    el.innerHTML = `<span class="song-announcement__note">♪</span> ${info.name}`;
    el.style.setProperty("--song-color", info.color);
    document.body.appendChild(el);
    setTimeout(() => el.classList.add("show"), 50);
    setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 500); }, 2800);
  }

  function triggerSongEffect(songFile) {
    const audio = new Audio(`./Others/Exos/notes/songs/${songFile}`);
    audio.play();
    showSongAnnouncement(songFile);
    clearEffects();
    switch (songFile) {
      case "storm.mp3": createSongOfStorms(); break;
      case "fire.mp3": createBoleroOfFire(); break;
      case "time.mp3": createSongOfTime(); break;
      case "sun.mp3": createSunSong(); break;
      case "water.mp3": createSerenadeOfWater(); break;
      case "forest.mp3": createMinuetOfForest(); break;
      case "epona.mp3": createEponasSong(); break;
      case "lullaby.mp3": createZeldasLullaby(); break;
      case "saria.mp3": createSariasSong(); break;
      case "light.mp3": createPreludeOfLight(); break;
      case "shadow.mp3": createNocturneOfShadow(); break;
      case "spirit.mp3": createRequiemOfSpirit(); break;
    }
  }

  loadAudioFiles();

  // --- GLOBAL KEY LISTENER ---
  let inputSeq = "";
  const CODES = {
    AWESOME: toggleAwesomeMode,
    NEO: toggleMatrixMode,
    MIRROR: () => document.body.classList.toggle("mirror-mode"),
    PLAY: toggleArcadeMode,
    XRAY: toggleXRayMode,
    PHYSICS: () => document.body.classList.toggle("physics-active"),
    HIRE: toggleNavi,

    ZELDA: () => {
        if (ocarinaMode) {
            keyboardEnabled = !keyboardEnabled;
            document.querySelectorAll(".ocarina-hint").forEach(h => h.style.opacity = keyboardEnabled ? "1" : "0");
        }
    }
  };

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (ocarinaMode && keyboardEnabled) {
      const keyMap = { ArrowUp: "Mi", ArrowDown: "Fa", ArrowLeft: "Si", ArrowRight: "Re", a: "La", A: "La" };
      if (keyMap[e.key]) { e.preventDefault(); playNoteWithEffect(keyMap[e.key]); return; }
    }
    const key = e.key.toUpperCase();
    if (key.length === 1) {
      inputSeq = (inputSeq + key).slice(-10);
      Object.keys(CODES).forEach(c => { if (inputSeq.endsWith(c)) { CODES[c](); inputSeq = ""; } });
    }
    checkKonami(e.key);
  });

  function checkKonami(k) {
    const kon = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    this.idx = this.idx || 0; 
    if (k === kon[this.idx] || k.toLowerCase() === kon[this.idx]) { 
        this.idx++; 
        if(this.idx === kon.length) { document.body.classList.toggle("vaporwave-mode"); this.idx=0; } 
    } else { this.idx=0; }
  }

  // --- AWESOME 3D MODE ---
  let awesomeActive = false, awesomeRaf = null, stars = [];
  function toggleAwesomeMode() {
    awesomeActive = document.body.classList.toggle("awesome-3d-mode");
    if (awesomeActive) {
      startAwesomeAnimation();
      document.addEventListener("mousemove", handleAwesomeTilt);
      playSynthSound(880, "sine", 0.5);
    } else {
      stopAwesomeAnimation();
      document.removeEventListener("mousemove", handleAwesomeTilt);
      const main = document.getElementById("main"); if(main) main.style.transform = "";
    }
  }

  function handleAwesomeTilt(e) {
    const x = (window.innerWidth / 2 - e.clientX) / 30, y = (window.innerHeight / 2 - e.clientY) / 30;
    const main = document.getElementById("main");
    if (main) {
      main.parentElement.style.perspective = "1000px";
      main.style.transform = `rotateX(${y}deg) rotateY(${-x}deg)`;
    }
  }

  function startAwesomeAnimation() {
    let canvas = document.getElementById("awesome-bg");
    if (!canvas) {
      canvas = document.createElement("canvas"); canvas.id = "awesome-bg";
      canvas.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;";
      document.body.appendChild(canvas);
      stars = []; for(let i=0; i<400; i++) stars.push({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() });
    }
    const ctx = canvas.getContext("2d");
    const anim = () => {
      if (!awesomeActive) return;
      canvas.width = window.innerWidth; canvas.height = window.innerHeight;
      ctx.fillStyle = "black"; ctx.fillRect(0,0,canvas.width, canvas.height);
      const cx = canvas.width/2, cy = canvas.height/2;
      stars.forEach(s => {
        s.z -= 0.005; if(s.z <= 0) s.z = 1;
        const x = cx + s.x * (cx/s.z), y = cy + s.y * (cy/s.z);
        if(x<0 || x>canvas.width || y<0 || y>canvas.height) s.z = 1;
        else { ctx.fillStyle = `hsl(${s.z*360}, 100%, 70%)`; ctx.beginPath(); ctx.arc(x,y,(1-s.z)*3,0,Math.PI*2); ctx.fill(); }
      });
      awesomeRaf = requestAnimationFrame(anim);
    };
    anim();
  }
  function stopAwesomeAnimation() { if(awesomeRaf) cancelAnimationFrame(awesomeRaf); document.getElementById("awesome-bg")?.remove(); }

  // --- ZELDA VISUAL EFFECTS ---
  function createSongOfStorms() {
    const rain = document.createElement("div"); rain.className = "rain-container active"; document.body.appendChild(rain);
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement("div"); drop.className = "rain-drop";
        drop.style.left = Math.random() * 100 + "%"; drop.style.animationDelay = Math.random() * 2 + "s";
        rain.appendChild(drop);
    }
    activeEffects.push(rain);
  }
  function createBoleroOfFire() {
    const fire = document.createElement("div"); fire.className = "fire-container"; document.body.appendChild(fire);
    const id = setInterval(() => {
        const ember = document.createElement("div"); ember.className = "ember";
        ember.style.left = Math.random() * 100 + "vw"; fire.appendChild(ember); setTimeout(() => ember.remove(), 3000);
    }, 50); activeIntervals.push(id); activeEffects.push(fire);
  }
  function createSongOfTime() {
    const overlay = document.createElement("div");
    overlay.className = "time-warp-overlay";
    document.body.appendChild(overlay);
    activeEffects.push(overlay);
  }
  function createSerenadeOfWater() {
    const water = document.createElement("div"); water.className = "water-overlay"; document.body.appendChild(water);
    const id = setInterval(() => {
        const b = document.createElement("div"); b.className = "bubble"; b.style.left = Math.random()*100+"vw";
        water.appendChild(b); setTimeout(() => b.remove(), 10000);
    }, 200); activeIntervals.push(id); activeEffects.push(water);
  }
  function createMinuetOfForest() {
    const forest = document.createElement("div"); forest.className = "forest-overlay"; document.body.appendChild(forest);
    const id = setInterval(() => {
        const s = document.createElement("div"); s.className = "forest-spore"; s.style.left = Math.random()*100+"vw";
        forest.appendChild(s); setTimeout(() => s.remove(), 15000);
    }, 300); activeIntervals.push(id); activeEffects.push(forest);
  }
  function createSunSong() { const sun = document.createElement("div"); sun.className = "sunrise-overlay"; document.body.appendChild(sun); activeEffects.push(sun); }
  function createEponasSong() { const horse = document.createElement("div"); horse.className = "horse-animation"; document.body.appendChild(horse); activeEffects.push(horse); }
  function createZeldasLullaby() { const star = document.createElement("div"); star.className = "lullaby-overlay"; document.body.appendChild(star); activeEffects.push(star); }
  function createSariasSong() {
    const sparkle = document.createElement("div"); sparkle.className = "saria-overlay"; document.body.appendChild(sparkle); activeEffects.push(sparkle);

    let naviShown = false;
    function showNaviAfterEffect() {
      if (naviShown) return;
      naviShown = true;
      const navi = document.getElementById("navi");
      const bubble = navi && navi.querySelector(".navi__bubble");
      if (navi && bubble) {
        bubble.textContent = "Hello! I'm Navi! I'll be flying around every now and then... Keep exploring — there might be more secrets waiting for you. Don't say I didn't warn you!";
        navi.classList.add("navi--show");
        const heyListen = new Audio("./Others/Exos/notes/songs/hello.mp3");
        heyListen.play().catch(() => {});
        setTimeout(() => navi.classList.remove("navi--show"), 10000);
        if (window.naviBoost) window.naviBoost();
      }
    }

    // Appear 1s before the 20s sariaGlow animation fully ends; animationend as fallback
    setTimeout(showNaviAfterEffect, 16000);
    sparkle.addEventListener("animationend", showNaviAfterEffect, { once: true });
  }
  function createPreludeOfLight() {
    const flash = document.createElement("div");
    flash.className = "prelude-flash";
    document.body.appendChild(flash);
    activeEffects.push(flash);
    setTimeout(() => {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }, 700);
  }

  function createNocturneOfShadow() {
    const shadow = document.createElement("div");
    shadow.className = "nocturne-shadow";
    document.body.appendChild(shadow);
    activeEffects.push(shadow);
    setTimeout(() => {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    }, 800);
  }
  function createRequiemOfSpirit() { const sand = document.createElement("div"); sand.className = "sandstorm-overlay"; document.body.appendChild(sand); activeEffects.push(sand); }

  // --- SUITE MODES ---
  function toggleMatrixMode() {
    const isM = document.body.classList.toggle("matrix-mode");
    if (isM) {
      const c = document.createElement("canvas"); c.id = "matrix-canvas"; document.body.appendChild(c);
      const ctx = c.getContext("2d"); c.width = window.innerWidth; c.height = window.innerHeight;
      const drops = new Array(Math.floor(c.width/20)).fill(1);
      const id = setInterval(() => {
        ctx.fillStyle = "rgba(0,0,0,0.05)"; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = "#0F0"; ctx.font = "20px monospace";
        drops.forEach((d,i) => { ctx.fillText(String.fromCharCode(Math.random()*128), i*20, d*20); if(d*20 > c.height && Math.random()>0.975) drops[i]=0; drops[i]++; });
      }, 33); activeIntervals.push(id);
    } else { document.getElementById("matrix-canvas")?.remove(); activeIntervals.forEach(clearInterval); activeIntervals=[]; }
  }
  function toggleArcadeMode() { document.body.classList.toggle("arcade-mode"); }
  function toggleXRayMode() { 
    const isX = document.body.classList.toggle("xray-active");
    if (isX) { const l = document.createElement("div"); l.id = "xray-lens"; l.style.display = "block"; l.innerHTML='<div class="xray-content">SCANNING...</div>'; document.body.appendChild(l); document.addEventListener("mousemove", updateXRay); }
    else { document.getElementById("xray-lens")?.remove(); document.removeEventListener("mousemove", updateXRay); }
  }
  function updateXRay(e) {
    const l = document.getElementById("xray-lens"); if(!l) return; l.style.left = `${e.clientX-160}px`; l.style.top = `${e.clientY-160}px`;
    const t = document.elementFromPoint(e.clientX, e.clientY);
    if (t && t !== l && !l.contains(t)) { const s = window.getComputedStyle(t); l.querySelector(".xray-content").innerHTML = `[TAG]: ${t.tagName}<br>[CLASS]: .${t.className.split(" ")[0] || "none"}<br>[ID]: #${t.id || "none"}<br>[FONT]: ${s.fontFamily.split(",")[0].replace(/"/g, '')}<br>[COLOR]: ${s.color}`; }
  }
  function toggleNavi() {
    let b = document.getElementById("hire-bot");
    if (!b) {
      b = document.createElement("div");
      b.id = "hire-bot";
      b.innerHTML = `
        <div class="hire-header">
          <span>🧚 Navi's Info Desk</span>
          <span class="hire-close">×</span>
        </div>
        <div class="hire-messages">
          <div class="msg msg-bot">Hello! I'm Navi, Khalil's self-appointed guide. Ask me anything about him, or pick a topic below!</div>
        </div>
        <div class="hire-options">
          <button class="hire-option" data-q="Who is Khalil?">Who is Khalil?</button>
          <button class="hire-option" data-q="Tell me about his projects">Projects</button>
          <button class="hire-option" data-q="What is his tech stack?">Tech Stack</button>
          <button class="hire-option" data-q="Is he available?">Available?</button>
          <button class="hire-option" data-q="Where can I find his CV?">CV / Resume</button>
          <button class="hire-option hire-option--contact" id="hire-contact-btn">Contact him →</button>
        </div>
        <div class="hire-input-area">
          <input class="hire-input" type="text" placeholder="Ask Navi anything…" />
          <button class="hire-send">➤</button>
        </div>
      `;
      document.body.appendChild(b);

      b.querySelector(".hire-close").addEventListener("click", () => b.style.display = "none");

      b.querySelector("#hire-contact-btn").addEventListener("click", () => {
        b.style.display = "none";
        document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
      });

      b.querySelectorAll(".hire-option[data-q]").forEach(btn => {
        btn.addEventListener("click", () => sendHireMsg(btn.dataset.q));
      });

      const input = b.querySelector(".hire-input");
      b.querySelector(".hire-send").addEventListener("click", () => { sendHireMsg(input.value); input.value = ""; });
      input.addEventListener("keydown", e => { if (e.key === "Enter") { sendHireMsg(input.value); input.value = ""; } });

      const FALLBACKS = [
        "Hmm, that's beyond even a fairy's wisdom. Try asking about his projects, stack, or availability!",
        "I've flown around this portfolio a lot, but I'm not sure about that one. Ask me about Khalil's skills or projects!",
        "Even the Great Deku Tree couldn't help me there. Try: 'projects', 'tech stack', or 'is he available?'",
        "That question sent me straight to the Lost Woods. I'm good on: projects, skills, contact, availability…",
      ];

      window.sendHireMsg = (text) => {
        if (!text.trim()) return;
        const msgs = b.querySelector(".hire-messages");
        msgs.innerHTML += `<div class="msg msg-user">${text}</div>`;
        msgs.scrollTop = msgs.scrollHeight;
        setTimeout(() => {
          const lt = text.toLowerCase();
          let reply;
          if (lt.match(/who|about|khalil|person|himself|background|bio/)) {
            reply = "Khalil is a passionate Full Stack developer based in France. Creative, curious, and the kind of person who hides a Starfox engine inside a portfolio. He's currently applying to university to keep levelling up.";
          } else if (lt.match(/project|work|built|made|app|website/)) {
            reply = "He's built a Solar System visualizer, a Laravel microblogging platform, Scrapidoo (a Chrome extension), a PICO-8 game, and more. All in the Projects section — go take a look!";
          } else if (lt.match(/stack|tech|language|framework|tool|code|program/)) {
            reply = "HTML, CSS, JavaScript, PHP, Go, Kotlin, React, Laravel, Node.js. He picks up new tech fast — just look at how many Ocarina songs this page supports.";
          } else if (lt.match(/skill|capab|know|expert|level/)) {
            reply = "Strong on the frontend, growing fast on the backend. He adapts quickly. You don't build a working 3D Starfox engine from scratch without picking things up fast.";
          } else if (lt.match(/hire|avail|open|opportun|job|position|recruit|looking|apprenti/)) {
            reply = "Yes! He's actively looking for opportunities and is also applying to university right now. Ready for the next quest. Click 'Contact him →' below!";
          } else if (lt.match(/univers|school|study|educat|formation|degree|diplom|bachelor|master/)) {
            reply = "He's currently applying to university to pursue his studies further in development. Strong practical foundation from his current programme — check the projects as proof.";
          } else if (lt.match(/contact|reach|email|message|touch|talk|meet/)) {
            reply = "Scroll down to the Contact section — there's a form right there. Or hit 'Contact him →' below and I'll take you straight to it!";
          } else if (lt.match(/cv|resume|download|pdf/)) {
            reply = "Drop him a message via the Contact section and he'll send his CV right over. Go ahead, he doesn't bite!";
          } else if (lt.match(/salary|pay|money|compensation|rate|wage|rupee/)) {
            reply = "Ah, the rupee question! That's between you and Khalil. Head to the Contact section and make him an offer he can't refuse.";
          } else if (lt.match(/hobby|interest|fun|passion|free time|game|gaming|outside/)) {
            reply = "Gaming, 3D animation, and hiding easter eggs in portfolios. The Ocarina in the header didn't build itself, you know.";
          } else if (lt.match(/locat|where|city|country|france|paris|remote/)) {
            reply = "Based in France, remote-friendly too. The internet reaches Hyrule just fine.";
          } else if (lt.match(/experienc|year|senior|junior|how long/)) {
            reply = "Junior developer with a strong project track record for his level. Quality over years — the Projects section speaks for itself.";
          } else if (lt.match(/hello|hi |hey|bonjour|salut/)) {
            reply = "Hey! Liste— I mean, hello to you too! Ask me anything about Khalil!";
          } else {
            reply = FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
          }
          msgs.innerHTML += `<div class="msg msg-bot">${reply}</div>`;
          msgs.scrollTop = msgs.scrollHeight;
        }, 700);
      };
    }
    b.style.display = (b.style.display === "flex") ? "none" : "flex";
  }
  function playSynthSound(f, t, d) {
    if (!audioContext) return; const n = audioContext.currentTime, o = audioContext.createOscillator(), g = audioContext.createGain();
    o.connect(g); g.connect(audioContext.destination); o.type = t; o.frequency.setValueAtTime(f, n);
    g.gain.setValueAtTime(0, n); g.gain.linearRampToValueAtTime(0.2, n+0.1); g.gain.exponentialRampToValueAtTime(0.01, n+d);
    o.start(n); o.stop(n+d);
  }
});
