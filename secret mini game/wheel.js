const wheel = document.getElementById("wheel");
const button = document.querySelector("button");

const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFD700", "#8B4513"];
const phrases = ["Gagné", "Perdu", "Perdu", "Perdu", "Perdu", "Perdu", "Perdu", "Perdu"];

let spinning = false;

button.addEventListener("click", spinWheel);

function spinWheel() {
  if (!spinning) {
    spinning = true;

    // Randomly select a color
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    const selectedColor = colors[randomColorIndex];
    const selectedPhrase = phrases[randomColorIndex];

    // Rotate the wheel
    const rotationAngle = randomColorIndex * (360 / colors.length);
    wheel.style.transition = "transform 3s ease-out";
    wheel.style.transform = `rotate(${rotationAngle}deg)`;

    // Wait for the animation to complete and show the alert
    setTimeout(() => {
      alert(`Vous avez : ${selectedPhrase}`);
      wheel.style.transition = ""; // Remove transition for future spins
      wheel.style.transform = ""; // Reset the rotation
      spinning = false;
    }, 3000);
  }
}
