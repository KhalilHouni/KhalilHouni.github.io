const wheel = document.getElementById("wheel");
const pointer = document.getElementById("pointer");
const spinButton = document.getElementById("spinButton");
const voiceToggle = document.getElementById("voiceToggle");
const forceNameButton = document.getElementById("forceName");
const repeatWinnerButton = document.getElementById("repeatWinner");

const words = ["Khalil", "Arthur", "Clara", "Sabri", "Lucas", "Mamé-Diara", "Neïs", "Adrien", "Maud", "Encadrant(te) du jour","Cloture"];
const phoneticNames = ["Kalil", "Arthur", "Clara", "Sabri", "Luka", "Mamé-Diara", "Neïsse", "Adrien", "Mode", "Encadrant(te) du jour","Cloture"];
const presence = ["Khalil", "Arthur", "Clara", "Sabri", "Lucas", "Mamé-Diara", "Neïs", "Adrien", "Maud", "Encadrant(te) du jour"];

let lastWinner = null;

let spinning = false;
let speaking = false;

spinButton.addEventListener("click", spinWheel);
voiceToggle.addEventListener("click", toggleVoice);

const playerListContainer = document.getElementById("playerListContainer");

function speakResult(result) {
  if (speaking) {
    const speech = new SpeechSynthesisUtterance(result);
    speech.lang = 'fr-FR';
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  }
}

function toggleVoice() {
  speaking = !speaking;
  const status = speaking ? "activée" : "désactivée";
  alert(`La voix est ${status}`);
  updateVoiceToggleStyle();
}

function updateVoiceToggleStyle() {
  voiceToggle.classList.toggle("active", speaking);
}
function spinWheel() {
  if (!spinning) {
    spinning = true;

    const rotationAngle = Math.floor(Math.random() * 360);

    wheel.style.transition = "transform 3s ease-out";
    wheel.style.transform = `rotate(${rotationAngle}deg)`;

    pointer.style.transition = "transform 3s ease-out";
    pointer.style.transform = `translate(-50%, -50%) rotate(${-rotationAngle}deg)`;

    const triangleContainer = document.createElement("div");
    triangleContainer.className = "wheel";

    for (let i = 0; i < words.length; i++) {
      const triangle = document.createElement("div");
      triangle.className = "triangle";
      const startAngle = (360 / words.length) * i;
      const endAngle = (360 / words.length) * (i + 1);
      triangle.style.background = `conic-gradient(from ${startAngle}deg to ${endAngle}deg, #fff 0%, #FFD700 50%, #fff 100%)`;
      triangle.style.borderLeftWidth = "200px";
      triangle.style.borderRightWidth = "200px";
      triangle.style.borderBottomWidth = "346.4px";
      triangle.style.borderLeftColor = "transparent";
      triangle.style.borderRightColor = "transparent";
      triangle.style.borderBottomColor = "transparent";
      triangle.style.transform = `rotate(${(360 / words.length) * i}deg)`;
      triangleContainer.appendChild(triangle);
    }

    wheel.innerHTML = "";
    wheel.appendChild(triangleContainer);

    setTimeout(() => {
      wheel.style.transition = "";
      wheel.style.transform = "";
      pointer.style.transition = "";
      pointer.style.transform = "";
      spinning = false;

      const randomWordIndex = Math.floor(Math.random() * words.length);
      const winner = words[randomWordIndex];
      lastWinner = winner;
      const phoneticName = phoneticNames[randomWordIndex];

      if (winner === "Cloture") {
        const selectedPlayer = chooseRandomPlayer();
        speakResult("C'est l'heure de la cloture ! " chacun à son tour, nous allons parler du déroulement de notre journée. C'est un moment où nous sommes en sécurité, où l'on ne se moque pas, où l'on n'interrompt pas la parole, et où l'on ne touche pas à son téléphone. Nous attendons que chacun ait parlé une fois pour clore la séance. Lucas, à toi de commencer !");
        alert("C'est l'heure de la cloture !");
      } else {
        speakResult(`${phoneticName} va démarrer la cloture aujourd'hui, ${phoneticName}`);
        alert(`${lastWinner} va démarrer la cloture aujourd'hui`);
      }
    }, 3000);
  }
}

function chooseRandomPlayer() {
  const checkboxes = document.querySelectorAll("#playerListContainer input[type='checkbox']:checked");
  const availablePlayers = [];

  checkboxes.forEach((checkbox) => {
    availablePlayers.push(checkbox.value);
  });

  const randomIndex = Math.floor(Math.random() * availablePlayers.length);
  return availablePlayers[randomIndex];
}


function displayPlayerList() {
  playerListContainer.innerHTML = "";

  words.forEach((player) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = player;
    checkbox.id = player;

    const label = document.createElement("label");
    label.htmlFor = player;
    label.appendChild(document.createTextNode(player));

    playerListContainer.appendChild(checkbox);
    playerListContainer.appendChild(label);
    playerListContainer.appendChild(document.createElement("br"));
  });

  const removeButton = document.createElement("button");
  removeButton.textContent = "Retirer les joueurs sélectionnés";
  removeButton.addEventListener("click", removeSelectedPlayers);
  playerListContainer.appendChild(removeButton);
}

function removeSelectedPlayers() {
  const checkboxes = document.querySelectorAll("#playerListContainer input[type='checkbox']:checked");

  checkboxes.forEach((checkbox) => {
    const playerName = checkbox.value;
    const playerIndex = words.indexOf(playerName);

    if (playerIndex !== -1) {
      words.splice(playerIndex, 1);
      phoneticNames.splice(playerIndex, 1); // Supprimer également le nom phonétique correspondant
    }
  });

  displayPlayerList();

}

function togglePresence(playerName) {
  const playerIndex = presence.indexOf(playerName);
  if (playerIndex === -1) {
    presence.push(playerName);
  } else {
    presence.splice(playerIndex, 1);
  }
  updatePlayerList();
}
function updatePlayerList() {
  playerListContainer.innerHTML = "";

  words.forEach((player) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = player;
    checkbox.id = player;
    checkbox.checked = presence.includes(player); // Cocher si le joueur est présent
    checkbox.addEventListener("click", () => togglePresence(player)); // Gérer le clic pour changer la présence

    const label = document.createElement("label");
    label.htmlFor = player;
    label.appendChild(document.createTextNode(player));

    if (presence.includes(player)) {
      label.classList.add("present"); // Ajouter la classe "present" si le joueur est présent
    } else if (!checkbox.checked) {
      label.classList.add("not-checked"); // Ajouter la classe "not-checked" si la case n'est pas cochée
    }

    playerListContainer.appendChild(checkbox);
    playerListContainer.appendChild(label);
    playerListContainer.appendChild(document.createElement("br"));
  });

  const removeButton = document.createElement("button");
  removeButton.textContent = "Retirer les joueurs sélectionnés";
  removeButton.addEventListener("click", removeSelectedPlayers);
  playerListContainer.appendChild(removeButton);
}


function chooseRandomPlayer() {
  const randomIndex = Math.floor(Math.random() * presence.length);
  return presence[randomIndex];
}

// Appel initial pour afficher la liste des joueurs
updatePlayerList();
