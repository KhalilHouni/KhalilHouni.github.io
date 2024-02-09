const wheel = document.getElementById("wheel");
const pointer = document.getElementById("pointer");
const spinButton = document.getElementById("spinButton");
const voiceSwitch = document.getElementById("voiceSwitch");

const words = ["Khalil", "Arthur", "Clara", "Sabri", "Lucas", "Lucas", "Mamé-Diara", "Neïsse", "Adrien", "Maud", "Encadrant(te) du jour"];

let spinning = false;
let speaking = true; // Initially set to true

spinButton.addEventListener("click", spinWheel);
voiceSwitch.addEventListener("change", toggleVoice);

function speakResult(result) {
  if (speaking) {
    const speech = new SpeechSynthesisUtterance(result);
    speech.lang = 'fr-FR';  // Specify the language

    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  }
}

function toggleVoice() {
  speaking = voiceSwitch.checked;
}

function spinWheel() {
  if (!spinning) {
    spinning = true;

    // Randomly select a rotation angle
    const rotationAngle = Math.floor(Math.random() * 360);

    // Rotate the wheel
    wheel.style.transition = "transform 3s ease-out";
    wheel.style.transform = `rotate(${rotationAngle}deg)`;

    // Rotate the pointer in the opposite direction
    pointer.style.transition = "transform 3s ease-out";
    pointer.style.transform = `translate(-50%, -50%) rotate(${-rotationAngle}deg)`;

    // Create triangles for each word
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

    // Replace the existing wheel with triangles
    wheel.innerHTML = "";
    wheel.appendChild(triangleContainer);

    // Wait for the animation to complete
    setTimeout(() => {
      wheel.style.transition = ""; // Remove transition for future spins
      wheel.style.transform = ""; // Reset the rotation
      pointer.style.transition = ""; // Remove transition for future spins
      pointer.style.transform = ""; // Reset the rotation
      spinning = false;

      // Randomly select a word
      const randomWordIndex = Math.floor(Math.random() * words.length);
      const selectedWord = words[randomWordIndex];

      // Speak the result
      speakResult(`${selectedWord} va démarrer la cloture aujourd'hui, ${selectedWord}`);

      // Show the selected word in an alert
      alert(`${selectedWord} va démarrer la cloture aujourd'hui`);
    }, 3000);
  }
}
