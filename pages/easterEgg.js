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
    document.body.classList.remove("time-warp-active", "matrix-mode", "mirror-mode", "vaporwave-mode", "physics-active", "xray-active", "arcade-mode", "awesome-3d-mode");
    stopAwesomeAnimation();
    document.removeEventListener("mousemove", handleAwesomeTilt);
    document.removeEventListener("mousemove", updateXRay);
    document.getElementById("xray-lens")?.remove();
    const main = document.getElementById("main"); if(main) main.style.transform = "";
  }

  function playNoteWithEffect(note) {
    const btn = document.querySelector(`.ocarina-note[data-note="${note}"]`);
    if (btn) { btn.classList.add("active"); setTimeout(() => btn.classList.remove("active"), 200); }
    playNote(note);
    checkSequence(note);
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

  function triggerSongEffect(songFile) {
    const audio = new Audio(`./Others/Exos/notes/songs/${songFile}`);
    audio.play();
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
    FOX: toggleStarfox,
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

  // --- STARFOX FULL 3D ENGINE ---
  let foxActive = false, foxPaused = false, foxRaf = null, foxKeys = {};
  let lastFoxTap = { key: null, time: 0 };
  let fState = {
    score: 0, health: 100, camX: 0, camY: 0, camZ: 0,
    player: { x: 0, y: 0, roll: 0, isRolling: false, rollAnim: 0, rollDir: 1 },
    bullets: [], enemyBullets: [], entities: [], particles: [],
    level: { wave: 1, timer: 0, bossSpawned: false, bossHp: 2000 },
    groundOffset: 0
  };

  const FOV = 400; const RENDER_DIST = 8000;

  function project(x, y, z, cx, cy) {
    if (z <= 10) return null;
    const scale = FOV / z;
    return { x: cx + x * scale, y: cy + y * scale, s: scale };
  }

  const MODELS = {
    arwing: {
      verts: [{x:0, y:-10, z:40}, {x:-30, y:5, z:-20}, {x:30, y:5, z:-20}, {x:0, y:-5, z:-20}, {x:0, y:10, z:-10}],
      faces: [{v:[0,1,3], c:"#ccc"}, {v:[0,2,3], c:"#eee"}, {v:[0,1,4], c:"#666"}, {v:[0,2,4], c:"#888"}, {v:[1,3,4], c:"#00f"}, {v:[2,3,4], c:"#00f"}]
    },
    enemy: {
      verts: [{x:0, y:0, z:30}, {x:-20, y:0, z:-20}, {x:20, y:0, z:-20}, {x:0, y:-20, z:-10}, {x:0, y:20, z:-10}],
      faces: [{v:[0,1,3], c:"#f0f"}, {v:[0,2,3], c:"#f4f"}, {v:[0,1,4], c:"#808"}, {v:[0,2,4], c:"#a0a"}]
    },
    boss: {
      verts: [{x:0, y:0, z:100}, {x:-150, y:-50, z:-100}, {x:150, y:-50, z:-100}, {x:-150, y:50, z:-100}, {x:150, y:50, z:-100}, {x:0, y:0, z:-150}],
      faces: [{v:[0,1,3], c:"#f00"}, {v:[0,2,4], c:"#f00"}, {v:[0,1,2], c:"#800"}, {v:[0,3,4], c:"#a00"}, {v:[1,3,5], c:"#400"}, {v:[2,4,5], c:"#400"}]
    }
  };

  function drawModel(ctx, model, worldX, worldY, worldZ, rotZ, rotY, cx, cy) {
    if (worldZ < 10) return;
    const projected = [];
    for (let i = 0; i < model.verts.length; i++) {
        let v = model.verts[i];
        let r_y = { x: v.x * Math.cos(rotY || 0) + v.z * Math.sin(rotY || 0), z: -v.x * Math.sin(rotY || 0) + v.z * Math.cos(rotY || 0) };
        let r_z = { x: r_y.x * Math.cos(rotZ) - v.y * Math.sin(rotZ), y: r_y.x * Math.sin(rotZ) + v.y * Math.cos(rotZ) };
        projected.push(project(r_z.x + worldX - fState.camX, r_z.y + worldY - fState.camY, r_y.z + worldZ - fState.camZ, cx, cy));
    }
    for (let face of model.faces) {
        let pts = face.v.map(idx => projected[idx]);
        if (pts.some(p => !p)) continue;
        if ((pts[1].x - pts[0].x) * (pts[2].y - pts[0].y) - (pts[1].y - pts[0].y) * (pts[2].x - pts[0].x) > 0) {
            ctx.fillStyle = face.c; ctx.strokeStyle = "#000"; ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
            for(let j=1; j<pts.length; j++) ctx.lineTo(pts[j].x, pts[j].y);
            ctx.closePath(); ctx.fill(); ctx.stroke();
        }
    }
  }

  function toggleStarfox() {
    foxActive = !foxActive; foxPaused = false;
    let container = document.getElementById("starfox-container");
    if (!container) {
      container = document.createElement("div"); container.id = "starfox-container";
      container.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000;z-index:20000;";
      container.innerHTML = `<canvas id="starfox-canvas" style="width:100%;height:100%;"></canvas>
        <div id="starfox-hud" style="position:absolute;top:20px;left:20px;color:#0f0;font-family:monospace;font-size:24px;">SCORE: <span id="fox-score">00000</span><br>SHIELD: <div style="display:inline-block;width:200px;height:15px;border:2px solid #fff;"><div id="fox-hp" style="height:100%;background:#0f0;width:100%;"></div></div><br>WAVE: <span id="fox-wave">1</span></div>
        <div id="starfox-msg" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#f00;font-size:4rem;font-weight:bold;display:none;text-shadow:0 0 20px #f00;"></div>`;
      document.body.appendChild(container);
    }
    container.style.display = foxActive ? "block" : "none";
    if (foxActive) {
      fState = { score: 0, health: 100, camX: 0, camY: 0, camZ: 0, player: { x: 0, y: 0, roll: 0, isRolling: false, rollAnim: 0, rollDir: 1 }, bullets: [], enemyBullets: [], entities: [], particles: [], level: { wave: 1, timer: 0, bossSpawned: false, bossHp: 2000 }, groundOffset: 0 };
      foxKeys = {}; window.addEventListener("keydown", foxKeyDn); window.addEventListener("keyup", foxKeyUp); 
      playSynthSound(150, "square", 1.5); foxLoop();
    } else {
      cancelAnimationFrame(foxRaf); window.removeEventListener("keydown", foxKeyDn); window.removeEventListener("keyup", foxKeyUp);
    }
  }

  function foxKeyDn(e) {
    if (!foxActive) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const now = Date.now();
        if (lastFoxTap.key === e.key && (now - lastFoxTap.time) < 250 && !fState.player.isRolling) {
            fState.player.isRolling = true; fState.player.rollAnim = 0; fState.player.rollDir = e.key === "ArrowLeft" ? -1 : 1;
        }
        lastFoxTap = { key: e.key, time: now };
    }
    foxKeys[e.key] = true;
    if (e.key === "Enter") { foxPaused = !foxPaused; document.getElementById("starfox-msg").innerText = foxPaused ? "PAUSED" : ""; document.getElementById("starfox-msg").style.display = foxPaused ? "block" : "none"; }
    if (e.key === " " && !foxPaused && !e.repeat) {
        // Wing Lasers Converging
        fState.bullets.push({ x: fState.player.x - 45, y: fState.player.y + 15, z: fState.camZ + 100, tx: fState.player.x, ty: fState.player.y, tz: fState.camZ + 3000, vz: 350 });
        fState.bullets.push({ x: fState.player.x + 45, y: fState.player.y + 15, z: fState.camZ + 100, tx: fState.player.x, ty: fState.player.y, tz: fState.camZ + 3000, vz: 350 });
        playSynthSound(400, "sawtooth", 0.05);
    }
  }
  function foxKeyUp(e) { if (foxActive) foxKeys[e.key] = false; }
  function showFoxMsg(text, keep = false) {
      const m = document.getElementById("starfox-msg"); m.innerText = text; m.style.display = text ? "block" : "none";
      if(text && !keep) setTimeout(() => m.style.display = "none", 3000);
  }

  function foxLoop() {
    if (!foxActive) return;
    if (foxPaused) { foxRaf = requestAnimationFrame(foxLoop); return; }
    const canvas = document.getElementById("starfox-canvas"), ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const cx = canvas.width / 2, cy = canvas.height / 2;

    fState.level.timer++; fState.camZ += 60;
    
    // Player
    let speed = fState.player.isRolling ? 35 : 18;
    if (foxKeys["ArrowLeft"]) { fState.player.x -= speed; if(!fState.player.isRolling) fState.player.roll = -0.5; }
    else if (foxKeys["ArrowRight"]) { fState.player.x += speed; if(!fState.player.isRolling) fState.player.roll = 0.5; }
    else fState.player.roll *= 0.8;
    if (foxKeys["ArrowUp"]) fState.player.y -= speed;
    if (foxKeys["ArrowDown"]) fState.player.y += speed;
    if (fState.player.isRolling) { fState.player.rollAnim += 0.5; fState.player.x += fState.player.rollDir * 25; if (fState.player.rollAnim >= Math.PI * 2) { fState.player.isRolling = false; fState.player.rollAnim = 0; } }
    
    fState.camX += (fState.player.x - fState.camX) * 0.1; fState.camY += (fState.player.y - fState.camY) * 0.1;
    fState.player.y = Math.min(300, fState.player.y); // Floor clamp
    if (fState.player.y > 285) { fState.health -= 0.5; if(Math.random()>0.9) playSynthSound(50, "sawtooth", 0.1); }

    // Wave Progression
    if (fState.level.timer === 1000) { fState.level.wave = 2; showFoxMsg("WAVE 2: REBEL SQUAD"); }
    if (fState.level.timer === 2000) { fState.level.wave = 3; showFoxMsg("DANGER: BOSS INBOUND"); }

    // Spawning
    if (fState.level.wave === 1 && Math.random() > 0.95) {
        fState.entities.push({ type: "pillar", x: (Math.random()-0.5)*4000, y: 400, z: fState.camZ + RENDER_DIST, hp: 100 });
    } else if (fState.level.wave === 2 && Math.random() > 0.96) {
        fState.entities.push({ type: "enemy", x: (Math.random()-0.5)*2000, y: (Math.random()-0.5)*1000, z: fState.camZ + RENDER_DIST, hp: 100, vx: (Math.random()-0.5)*20, lastShoot: 0 });
    } else if (fState.level.wave === 3 && !fState.level.bossSpawned) {
        fState.level.bossSpawned = true;
        fState.entities.push({ type: "boss", x: 0, y: -200, z: fState.camZ + 4000, hp: 3000, vx: 15, lastShoot: 0 });
    }

    ctx.fillStyle = "#000814"; ctx.fillRect(0,0,canvas.width, canvas.height);
    
    // Mode-7 Ground Grid
    ctx.strokeStyle = "#0044aa"; ctx.lineWidth = 2;
    for (let z = 200; z < RENDER_DIST; z += 400) {
        let worldZ = fState.camZ + z - (fState.camZ % 400);
        let p = project(0 - fState.camX, 400 - fState.camY, worldZ - fState.camZ, cx, cy);
        if (p && p.y > cy) { ctx.globalAlpha = 1 - (z/RENDER_DIST); ctx.beginPath(); ctx.moveTo(0, p.y); ctx.lineTo(canvas.width, p.y); ctx.stroke(); }
    }
    ctx.globalAlpha = 1;

    fState.entities.sort((a,b) => b.z - a.z);
    fState.entities.forEach((e, i) => {
      // Logic
      if (e.type === "enemy" || e.type === "boss") {
          e.x += e.vx; if(e.type==="boss" && (e.x>1500 || e.x<-1500)) e.vx *= -1;
          if (e.z - fState.camZ < 4000 && fState.level.timer - e.lastShoot > (e.type==="boss"?30:80)) {
              let dx = fState.player.x - e.x; let dy = fState.player.y - e.y; let dz = fState.camZ - e.z;
              let len = Math.sqrt(dx*dx + dy*dy + dz*dz);
              fState.enemyBullets.push({ x: e.x, y: e.y, z: e.z, vx: (dx/len)*60, vy: (dy/len)*60, vz: (dz/len)*60 });
              e.lastShoot = fState.level.timer;
          }
          if (e.type === "boss") e.z = fState.camZ + 3500;
      }
      
      let relZ = e.z - fState.camZ;
      if (relZ < 0) { fState.entities.splice(i, 1); return; }
      let p = project(e.x - fState.camX, e.y - fState.camY, relZ, cx, cy);
      if (p) {
        if (e.type === "pillar") {
            let pTop = project(e.x - fState.camX, e.y - 1500 - fState.camY, relZ, cx, cy);
            if (pTop) { ctx.fillStyle = "#0ff"; ctx.beginPath(); ctx.moveTo(p.x - 120*p.s, p.y); ctx.lineTo(p.x + 120*p.s, p.y); ctx.lineTo(pTop.x + 120*p.s, pTop.y); ctx.lineTo(pTop.x - 120*p.s, pTop.y); ctx.closePath(); ctx.fill(); }
        } else if (e.type === "enemy") {
            drawModel(ctx, MODELS.enemy, e.x, e.y, e.z, fState.level.timer*0.1, 0, cx, cy);
        } else if (e.type === "boss") {
            drawModel(ctx, MODELS.boss, e.x, e.y, e.z, 0, Math.sin(fState.level.timer*0.05), cx, cy);
        }
        // Player Collision
        if(!fState.player.isRolling && relZ < 100 && Math.abs(e.x - fState.player.x) < 200 && Math.abs(e.y - fState.player.y) < 200) {
            fState.health -= 25; playSynthSound(80, "sawtooth", 0.5); if(e.type!=="boss") fState.entities.splice(i, 1);
        }
      }

      fState.bullets.forEach((b, bi) => {
        if (Math.abs(b.z - e.z) < 300 && Math.abs(b.currX - e.x) < 300 && Math.abs(b.currY - e.y) < 300) {
            e.hp -= 50; fState.bullets.splice(bi, 1); createExplosion(e.x, e.y, e.z, "#ff0");
            if (e.hp <= 0) { fState.score += (e.type==="boss"?5000:200); fState.entities.splice(i, 1); if(e.type==="boss"){ showFoxMsg("LYLAT SYSTEM SECURED!", true); setTimeout(toggleStarfox, 4000); } }
        }
      });
    });

    // Enemy Bullets
    fState.enemyBullets.forEach((eb, i) => {
        eb.x += eb.vx; eb.y += eb.vy; eb.z += eb.vz;
        if (eb.z < fState.camZ) {
            if(!fState.player.isRolling && Math.abs(eb.x - fState.player.x) < 100 && Math.abs(eb.y - fState.player.y) < 100) { fState.health -= 10; playSynthSound(120, "sawtooth", 0.2); }
            fState.enemyBullets.splice(i, 1); return;
        }
        let p = project(eb.x - fState.camX, eb.y - fState.camY, eb.z - fState.camZ, cx, cy);
        if(p) { ctx.fillStyle = "#f00"; ctx.beginPath(); ctx.arc(p.x, p.y, 8*p.s, 0, Math.PI*2); ctx.fill(); }
    });

    // Player Bullets
    fState.bullets.forEach((b, i) => {
        b.z += b.vz; if (b.z > fState.camZ + RENDER_DIST) { fState.bullets.splice(i, 1); return; }
        const prog = (b.z - (fState.camZ + 100)) / 2900;
        b.currX = b.x + (b.tx - b.x) * prog; b.currY = b.y + (b.ty - b.y) * prog;
        let p = project(b.currX - fState.camX, b.currY - fState.camY, b.z - fState.camZ, cx, cy);
        if (p) { ctx.strokeStyle = "#0ff"; ctx.lineWidth = 5 * p.s; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y - 30*p.s); ctx.stroke(); }
    });

    // Explosion Particles
    fState.particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.z += p.vz; p.life -= 0.05;
        if (p.life <= 0) { fState.particles.splice(i, 1); return; }
        let pr = project(p.x - fState.camX, p.y - fState.camY, p.z - fState.camZ, cx, cy);
        if (pr) { ctx.globalAlpha = p.life; ctx.fillStyle = p.c; ctx.fillRect(pr.x - 20*pr.s, pr.y - 20*pr.s, 40*pr.s, 40*pr.s); }
    });
    ctx.globalAlpha = 1;

    // Draw Arwing
    drawModel(ctx, MODELS.arwing, fState.player.x, fState.player.y, fState.camZ + 200, fState.player.roll + fState.player.rollAnim, 0, cx, cy);
    
    // Crosshair
    ctx.strokeStyle = "#0f0"; ctx.strokeRect(cx - 20, cy - 20, 40, 40);
    ctx.beginPath(); ctx.moveTo(cx, cy-10); ctx.lineTo(cx, cy+10); ctx.moveTo(cx-10, cy); ctx.lineTo(cx+10, cy); ctx.stroke();

    document.getElementById("fox-score").innerText = fState.score.toString().padStart(5, '0');
    document.getElementById("fox-hp").style.width = Math.max(0, fState.health) + "%";
    document.getElementById("fox-wave").innerText = fState.level.wave;
    if (fState.health <= 0) { showFoxMsg("ARWING DESTROYED", true); setTimeout(toggleStarfox, 3000); }
    else foxRaf = requestAnimationFrame(foxLoop);
  }

  function createExplosion(x,y,z,c) { for(let i=0; i<15; i++) fState.particles.push({ x,y,z, vx:(Math.random()-0.5)*50, vy:(Math.random()-0.5)*50, vz:(Math.random()-0.5)*50, life:1, c }); }

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
  function createSongOfTime() { document.body.classList.add("time-warp-active"); }
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
  function createSariasSong() { const sparkle = document.createElement("div"); sparkle.className = "saria-overlay"; document.body.appendChild(sparkle); activeEffects.push(sparkle); }
  function createPreludeOfLight() { document.documentElement.classList.remove("dark-mode"); }
  function createNocturneOfShadow() { document.documentElement.classList.add("dark-mode"); }
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
      b = document.createElement("div"); b.id = "hire-bot"; 
      b.innerHTML = `<div class="hire-header">Navi 🧚 <span style="cursor:pointer" onclick="this.parentElement.parentElement.style.display='none'">×</span></div>
        <div class="hire-messages"><div class="msg msg-bot">Hey listen! I'm Navi, your guide to Khalil's world. What would you like to know?</div></div>
        <div class="hire-options"><button class="hire-option" onclick="sendHireMsg('Tell me about Khalil')">About Khalil</button>
        <button class="hire-option" onclick="sendHireMsg('What projects did he do?')">Projects</button>
        <button class="hire-option" onclick="sendHireMsg('Technical stack?')">Tech Stack</button>
        <button class="hire-option" onclick="sendHireMsg('Hobbies?')">Hobbies</button>
        <button class="hire-option" onclick="sendHireMsg('Is he available?')">Hire him!</button></div>`; 
      document.body.appendChild(b);
      window.sendHireMsg = (text) => {
        const msgs = b.querySelector(".hire-messages"); msgs.innerHTML += `<div class="msg msg-user">${text}</div>`;
        setTimeout(() => {
          let reply = "He is actively looking for apprenticeship! Check his CV!";
          const lt = text.toLowerCase();
          if (lt.includes("about")) reply = "Khalil is a dedicated Full Stack student in France. Passionate and creative!";
          else if (lt.includes("projects")) reply = "Solar system visualizer, Laravel microblogging, and Scrapidoo extension!";
          else if (lt.includes("stack")) reply = "React, Node.js, PHP, Go and Kotlin!";
          else if (lt.includes("hobbies")) reply = "3D animations, gaming, and easter eggs!";
          msgs.innerHTML += `<div class="msg msg-bot">${reply}</div>`; msgs.scrollTop = msgs.scrollHeight;
        }, 800);
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
