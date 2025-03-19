let clickCount = 0;
const CLICK_THRESHOLD = 7;
let ocarinaMode = false;
let noteSequence = [];
const SEQUENCES = {
    'Mi-Si-Ré-Mi-Si-Ré': 'epona.mp3',
    'Fa-La-Fa-La-Ré-Fa-Ré-Fa': 'fire.mp3',
    'La-Mi-Si-Ré-Si-Ré': 'forest.mp3',
    'Mi-Ré-Mi-Ré-Si-Mi': 'light.mp3',
    'Si-Mi-Ré-Si-Mi-Ré': 'lullaby.mp3',
    'Fa-Ré-Si-Fa-Ré-Si': 'saria.mp3',
    'Si-Ré-Ré-La-Si-Ré-Fa': 'shadow.mp3',
    'La-Fa-La-Ré-Fa-La': 'spirit.mp3',
    'La-Fa-Mi-La-Fa-Mi': 'storm.mp3',
    'Ré-Fa-Mi-Ré-Fa-Mi': 'sun.mp3',
    'Ré-La-Fa-Ré-La-Fa': 'time.mp3',
    'La-Fa-Ré-Ré-Si': 'water.mp3',
    
};

let isRaining = false;
let rainContainer = null;
let rainSound = null;

document.addEventListener('DOMContentLoaded', function() {
    const welcomeLink = document.querySelector('.header__home');
    const header = document.querySelector('.header__nav');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffers = {};
    
    // Précharger les fichiers audio
    async function loadAudioFiles() {
        const notes = ['La', 'Mi', 'Ré', 'Si', 'Fa'];  
        for (const note of notes) {
            try {
                const response = await fetch(`./Others/Exos/notes/${note.toLowerCase()}.wav`);
                const arrayBuffer = await response.arrayBuffer();
                audioBuffers[note] = await audioContext.decodeAudioData(arrayBuffer);
            } catch (error) {
                console.error(`Erreur lors du chargement de ${note}.wav:`, error);
            }
        }
    }

    // Initialiser et garder le compteur de clics
    welcomeLink.addEventListener('click', function(e) {
        e.preventDefault();
        clickCount++;
        if (clickCount === CLICK_THRESHOLD && !ocarinaMode) {
            activateOcarinaMode();
        }
    });

    let zeldaSequence = '';
    const ZELDA_CODE = 'ZELDA';
    let keyboardEnabled = false;

    // Ajouter l'écouteur d'événements pour le clavier
    document.addEventListener('keydown', function(e) {
        if (!ocarinaMode) return;

        // Gestion de la séquence ZELDA
        const key = e.key.toUpperCase();
        if (ZELDA_CODE.includes(key)) {
            if (key === ZELDA_CODE[zeldaSequence.length]) {
                zeldaSequence += key;
                if (zeldaSequence === ZELDA_CODE) {
                    activateKeyboardControls();
                    zeldaSequence = '';
                }
            } else {
                zeldaSequence = key === ZELDA_CODE[0] ? key : '';
            }
        }

        // Si le clavier est activé, empêcher le défilement avec les flèches
        if (keyboardEnabled && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            
            switch(e.key) {
                case 'ArrowUp':
                    playNoteWithEffect('Mi');
                    break;
                case 'ArrowDown':
                    playNoteWithEffect('Fa');
                    break;
                case 'ArrowLeft':
                    playNoteWithEffect('Si');
                    break;
                case 'ArrowRight':
                    playNoteWithEffect('Ré');
                    break;
            }
        }

        // Continuer à gérer la touche 'A'
        if (keyboardEnabled && (e.key === 'a' || e.key === 'A')) {
            playNoteWithEffect('La');
        }
    });

    function activateKeyboardControls() {
        keyboardEnabled = true;
        const notes = document.querySelectorAll('.ocarina-note');
        
        // Effet visuel pour montrer que le clavier est activé
        notes.forEach(note => {
            note.style.animation = 'activationPulse 0.5s ease-out';
            setTimeout(() => {
                note.style.animation = '';
            }, 500);
        });

        // Ajouter les indicateurs de touches avec les bonnes correspondances
        const keyMap = {
            'La': 'A',
            'Mi': '↑',
            'Ré': '→',
            'Fa': '↓',
            'Si': '←',
        };

        notes.forEach(note => {
            const keyIndicator = document.createElement('div');
            keyIndicator.className = 'key-indicator';
            keyIndicator.textContent = keyMap[note.textContent] || '';
            note.appendChild(keyIndicator);
        });
    }

    function playNoteWithEffect(note) {
        // Trouver le bouton correspondant à la note
        const noteButton = document.querySelector(`.ocarina-note[data-note="${note}"]`);
        if (noteButton) {
            // Ajouter un effet visuel
            noteButton.classList.add('active');
            setTimeout(() => noteButton.classList.remove('active'), 200);
        }
        
        // Jouer la note et vérifier la séquence
        playNote(note);
        checkSequence(note);
    }

    function activateOcarinaMode() {
        ocarinaMode = true;
        header.classList.add('ocarina-mode');
        
        const ocarinaDiv = document.createElement('div');
        ocarinaDiv.className = 'ocarina-container';
        
        const noteNames = ['La', 'Mi', 'Ré', 'Si', 'Fa'];  
        
        noteNames.forEach((note, index) => {
            const button = document.createElement('button');
            button.className = 'ocarina-note';
            button.textContent = note;
            button.setAttribute('data-note', note);
            button.style.setProperty('--delay', `${index * 0.1}s`);
            
            button.addEventListener('click', () => {
                playNote(note);
                checkSequence(note);
            });
            
            ocarinaDiv.appendChild(button);
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        closeButton.className = 'ocarina-close';
        closeButton.addEventListener('click', deactivateOcarinaMode);

        header.prepend(ocarinaDiv);
        header.appendChild(closeButton);
    }

    function playNote(note) {
        if (audioBuffers[note]) {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffers[note];
            source.connect(audioContext.destination);
            source.start(0);
        }
    }

    function playSequence(sequence) {
        sequence.forEach((note, index) => {
            setTimeout(() => {
                playNote(note);
            }, index * 400);
        });
    }

    function createRainEffect() {
        if (isRaining) return; // Évite de créer plusieurs effets de pluie
        isRaining = true;
        
        rainContainer = document.createElement('div');
        rainContainer.className = 'rain-container';
        document.body.appendChild(rainContainer);
    
        // Augmenter le nombre de gouttes
        for (let i = 0; i < 200; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            
            // Position et timing aléatoires plus naturels
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDelay = `${Math.random() * 3}s`;
            drop.style.opacity = 0.1 + Math.random() * 0.3;
            
            // Variation de la vitesse
            const duration = 0.5 + Math.random();
            drop.style.animationDuration = `${duration}s`;
            
            rainContainer.appendChild(drop);
        }
    
        // Activate the rain effect
        requestAnimationFrame(() => {
            rainContainer.classList.add('active');
        });
    
        // Play rain sound
        rainSound = new Audio('./Others/Exos/notes/songs/rain.mp3');
        rainSound.volume = 0.3;
        rainSound.loop = true;
        rainSound.play();
    }
    
    function showSunriseEffect() {
        const sunrise = document.createElement('div');
        sunrise.className = 'sunrise-overlay';
        document.body.appendChild(sunrise);

        // Suppression de l'effet de lever de soleil après l'animation
        setTimeout(() => {
            sunrise.remove();
        }, 5000);
    }

    function stopRain() {
        if (!isRaining) return;
        
        isRaining = false;
        
        if (rainContainer) {
            rainContainer.classList.remove('active');
            setTimeout(() => {
                rainContainer.remove();
                rainContainer = null;
            }, 2000);
        }
        if (rainSound) {
            rainSound.pause();
            rainSound = null;
        }
    }

    function createWaterEffect() {
        const water = document.createElement('div');
        water.className = 'water-overlay';
        document.body.appendChild(water);

        // Effet de son d'eau
        const waterSound = new Audio('./Others/Exos/notes/songs/water.mp3');
        waterSound.volume = 0.3;
        waterSound.play();

        // Supprimer l'effet après l'animation
        setTimeout(() => {
            water.remove();
            waterSound.pause();
        }, 20000);
    }

    function createFireEffect() {
        const fireContainer = document.createElement('div');
        fireContainer.className = 'fire-container';
        
        // Créer l'overlay pour l'effet de lueur
        const fireOverlay = document.createElement('div');
        fireOverlay.className = 'fire-overlay';
        
        // Ajouter des flammes animées
        for (let i = 0; i < 20; i++) {
            const flame = document.createElement('div');
            flame.className = 'flame';
            flame.style.left = `${Math.random() * 100}%`;
            flame.style.animationDelay = `${Math.random() * 2}s`;
            flame.style.width = `${50 + Math.random() * 100}px`;
            fireContainer.appendChild(flame);
        }
    
        document.body.appendChild(fireOverlay);
        document.body.appendChild(fireContainer);
    
        // Son du feu
        const fireSound = new Audio('./Others/Exos/notes/songs/fire.mp3');
        fireSound.volume = 0.3;
        fireSound.loop = true;
        fireSound.play();
    
        // Supprimer l'effet après 20 secondes
        setTimeout(() => {
            fireContainer.remove();
            fireOverlay.remove();
            fireSound.pause();
        }, 20000);
    }

    function createForestEffect() {
        const forestOverlay = document.createElement('div');
        forestOverlay.className = 'forest-overlay';
        document.body.appendChild(forestOverlay);

        // Création des feuilles
        function createLeaf() {
            const leaf = document.createElement('div');
            leaf.className = 'leaf';
            leaf.style.left = `${Math.random() * 100}%`;
            leaf.style.transform = `scale(${0.5 + Math.random() * 0.5})`;
            document.body.appendChild(leaf);

            // Suppression de la feuille après l'animation
            leaf.addEventListener('animationend', () => leaf.remove());
        }

        // Création continue de feuilles
        const leafInterval = setInterval(() => {
            createLeaf();
        }, 300);

        // Son de forêt
        const forestSound = new Audio('./Others/Exos/notes/songs/forest.mp3');
        forestSound.volume = 0.3;
        forestSound.play();

        // Nettoyage après 20 secondes
        setTimeout(() => {
            clearInterval(leafInterval);
            forestOverlay.remove();
            forestSound.pause();
        }, 20000);
    }

    function createSariaEffect() {
        const sariaOverlay = document.createElement('div');
        sariaOverlay.className = 'saria-overlay';
        document.body.appendChild(sariaOverlay);
    
        // Ajouter plus d'étincelles magiques avec différents délais
        for (let i = 0; i < 100; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'magic-sparkle';
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.animationDelay = `${Math.random() * 4}s`;
            sparkle.style.opacity = Math.random();
            sariaOverlay.appendChild(sparkle);
        }
    
        const sariaSound = new Audio('./Others/Exos/notes/songs/saria.mp3');
        sariaSound.volume = 0.3;
        sariaSound.play();
    
        // Gestion de la transition de sortie
        setTimeout(() => {
            // Commencer à diminuer le volume 2 secondes avant la fin
            const fadeOut = setInterval(() => {
                if (sariaSound.volume > 0.02) {
                    sariaSound.volume -= 0.02;
                } else {
                    clearInterval(fadeOut);
                    sariaSound.pause();
                }
            }, 100);
    
            sariaOverlay.style.opacity = '0';
            setTimeout(() => {
                sariaOverlay.remove();
            }, 2000);
        }, 18000);
    }
    
    function createSandstormEffect() {
        const sandstormOverlay = document.createElement('div');
        sandstormOverlay.className = 'sandstorm-overlay';
        document.body.appendChild(sandstormOverlay);
    
        // Ajouter des particules de sable
        for (let i = 0; i < 200; i++) {
            const particle = document.createElement('div');
            particle.className = 'sand-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            sandstormOverlay.appendChild(particle);
        }
    
        const spiritSound = new Audio('./Others/Exos/notes/songs/spirit.mp3');
        spiritSound.volume = 0.3;
        spiritSound.play();
    
        setTimeout(() => {
            sandstormOverlay.remove();
            spiritSound.pause();
        }, 20000);
    }
    
    function createShadowEffect() {
        // Forcer le mode sombre
        document.documentElement.classList.add('dark-mode');
        
        const shadowOverlay = document.createElement('div');
        shadowOverlay.className = 'shadow-overlay';
        document.body.appendChild(shadowOverlay);
    
        // Ajouter des créatures sombres
        for (let i = 0; i < 5; i++) {
            const creature = document.createElement('div');
            creature.className = 'shadow-creature';
            creature.style.animationDelay = `${Math.random() * 5}s`;
            shadowOverlay.appendChild(creature);
        }
    
        // Son d'ambiance sinistre
        const shadowSound = new Audio('./Others/Exos/notes/songs/shadow.mp3');
        shadowSound.volume = 0.3;
        shadowSound.play();
    
        setTimeout(() => {
            shadowOverlay.remove();
            shadowSound.pause();
        }, 20000);
    }

    function createLightEffect() {
        const lightContainer = document.createElement('div');
        lightContainer.className = 'light-rays';
        
        // Créer l'orbe de lumière en premier
        const lightOrb = document.createElement('div');
        lightOrb.className = 'light-orb';
        
        // Créer les rayons de lumière autour de l'orbe
        for (let i = 0; i < 12; i++) {
            const ray = document.createElement('div');
            ray.className = 'light-ray';
            // Positionner les rayons autour de l'orbe avec un angle égal entre chaque rayon
            const angle = (i * 30) + 'deg';
            ray.style.transform = `rotate(${angle})`;
            ray.style.animationDelay = `${i * 0.2}s`;
            lightContainer.appendChild(ray);
        }
        
        document.body.appendChild(lightContainer);
        document.body.appendChild(lightOrb);
    
        // Son de lumière
        const lightSound = new Audio('./Others/Exos/notes/songs/light.mp3');
        lightSound.volume = 0.3;
        lightSound.play();
    
        // Nettoyage et activation du mode clair à la fin de l'animation
        setTimeout(() => {
            lightContainer.remove();
            lightOrb.remove();
            lightSound.pause();
            document.documentElement.classList.remove('dark-mode');
        }, 20000);
    }

    function createTimeEffect() {
        const timeOverlay = document.createElement('div');
        timeOverlay.className = 'time-overlay';
        document.body.appendChild(timeOverlay);
    
        const timeSpiral = document.createElement('div');
        timeSpiral.className = 'time-spiral';
        timeOverlay.appendChild(timeSpiral);
    
        // Ajouter des particules qui voyagent dans le temps
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'time-particles';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            timeOverlay.appendChild(particle);
        }
    
        // Son du voyage dans le temps
        const timeSound = new Audio('./Others/Exos/notes/songs/time.mp3');
        timeSound.volume = 0.3;
        timeSound.play();
    
        // Effet de ralentissement temporel sur la page
        document.body.style.transition = 'filter 1s';
        document.body.style.filter = 'saturate(130%) brightness(110%)';
    
        setTimeout(() => {
            timeOverlay.remove();
            timeSound.pause();
            document.body.style.filter = '';
        }, 10000); // Réduit à 10 secondes au lieu de 20
    }

    function createLullabyEffect() {
        const lullabyOverlay = document.createElement('div');
        lullabyOverlay.className = 'lullaby-overlay';
        document.body.appendChild(lullabyOverlay);

        // Ajouter des étoiles scintillantes
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'lullaby-star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            lullabyOverlay.appendChild(star);
        }

        // Son de berceuse
        const lullabySound = new Audio('./Others/Exos/notes/songs/lullaby.mp3');
        lullabySound.volume = 0.3;
        lullabySound.play();

        // Nettoyage après l'animation
        setTimeout(() => {
            lullabyOverlay.style.opacity = '0';
            setTimeout(() => {
                lullabyOverlay.remove();
                lullabySound.pause();
            }, 1000);
        }, 19000);
    }

    function playMp3(songFile) {
        const audio = new Audio(`./Others/Exos/notes/songs/${songFile}`);
        audio.play();
        
        if (songFile === 'storm.mp3') {
            createRainEffect();
        } else if (songFile === 'sun.mp3') {
            showSunriseEffect();
            if (isRaining) {
                stopRain();
            }
        } else if (songFile === 'epona.mp3') {
            createHorseEffect();
        } else if (songFile === 'water.mp3') {
            createWaterEffect();
        } else if (songFile === 'fire.mp3') {
            createFireEffect();
        } else if (songFile === 'forest.mp3') {
            createForestEffect();
        } else if (songFile === 'saria.mp3') {
            createSariaEffect();
        } else if (songFile === 'spirit.mp3') {
            createSandstormEffect();
        } else if (songFile === 'shadow.mp3') {
            createShadowEffect();
        } else if (songFile === 'light.mp3') {
            createLightEffect();
        } else if (songFile === 'time.mp3') {
            createTimeEffect();
        } else if (songFile === 'lullaby.mp3') {
            createLullabyEffect();
        }
    }

    function createHorseEffect() {
        const horse = document.createElement('div');
        horse.className = 'horse-animation';
        document.body.appendChild(horse);

        setTimeout(() => {
            horse.remove();
        }, 8000);
    }

    function checkSequence(note) {
        noteSequence.push(note);
        
        // Trouver la longueur de la plus longue séquence
        const maxLength = Math.max(...Object.keys(SEQUENCES).map(seq => seq.split('-').length));
        
        // Garder seulement les dernières notes (selon la plus longue séquence)
        if (noteSequence.length > maxLength) {
            noteSequence.shift();
        }

        // Vérifier toutes les séquences possibles
        const currentSequence = noteSequence.join('-');
        for (let [sequence, song] of Object.entries(SEQUENCES)) {
            if (currentSequence.endsWith(sequence)) {
                playSuccess();
                setTimeout(() => {
                    playMp3(song);
                }, 1000);
                noteSequence = [];
                break;
            }
        }
    }

    function playSuccess() {
        const successOsc = audioContext.createOscillator();
        const successGain = audioContext.createGain();
        
        successOsc.connect(successGain);
        successGain.connect(audioContext.destination);
        
        successOsc.type = 'sine';
        successGain.gain.value = 0.3;
        
        // Joue un petit "ding ding"
        successOsc.frequency.value = 880; // La5
        successOsc.start();
        successOsc.stop(audioContext.currentTime + 0.15);
        
        setTimeout(() => {
            const secondDing = audioContext.createOscillator();
            const secondGain = audioContext.createGain();
            
            secondDing.connect(secondGain);
            secondGain.connect(audioContext.destination);
            
            secondDing.type = 'sine';
            secondGain.gain.value = 0.3;
            
            secondDing.frequency.value = 1108.73; // Do#6
            secondDing.start();
            secondDing.stop(audioContext.currentTime + 0.15);
        }, 150);
    }

    function deactivateOcarinaMode() {
        ocarinaMode = false;
        clickCount = 0;
        header.classList.remove('ocarina-mode');
        document.querySelector('.ocarina-container').remove();
        document.querySelector('.ocarina-close').remove();
    }

    // Charger les fichiers audio au démarrage
    loadAudioFiles();
});
