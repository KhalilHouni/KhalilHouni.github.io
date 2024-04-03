const wheel = document.getElementById("wheel");
const pointer = document.getElementById("pointer");
const spinButton = document.getElementById("spinButton");
const voiceToggle = document.getElementById("voiceToggle");
const forceNameButton = document.getElementById("forceName");
const repeatWinnerButton = document.getElementById("repeatWinner");

const words = ["Arthur", "Clara","Neïs","Maud", "Encadrant(te) du jour"];
const phoneticNames = ["Arthur", "Clara","Neïsse","Moode", "Encadrant(te) du jour"];
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
      lastWinner = words[randomWordIndex];
      const phoneticName = phoneticNames[randomWordIndex];

      speakResult(`${phoneticName} va démarrer la cloture aujourd'hui, ${phoneticName}`);

      alert(`${lastWinner} va démarrer la cloture aujourd'hui`);
    }, 3000);
  }
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
