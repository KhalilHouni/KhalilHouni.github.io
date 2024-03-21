// Get the visitor count from localStorage or set it to 0 if not present
let visitorCount = localStorage.getItem("visitorCount") || 0;

// Update the visitor count on the page
document.getElementById("visitorCount").textContent = visitorCount;

// Increment the visitor count and update localStorage when the page is visited
visitorCount++;
localStorage.setItem("visitorCount", visitorCount);

// Konami code sequence
const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a"
];

let konamiCodeIndex = 0;

// Event listener for keydown events
document.addEventListener("keydown", function(event) {
    // Get the key pressed by the user
    const key = event.key;

    // Check if the pressed key matches the current sequence in the Konami code
    if (key === konamiCode[konamiCodeIndex]) {
        konamiCodeIndex++;

        // If the entire Konami code is entered, display the secret message
        if (konamiCodeIndex === konamiCode.length) {
            document.getElementById("secretMessage").classList.remove("hidden");
        }
    } else {
        // If the pressed key is incorrect, reset the code index
        konamiCodeIndex = 0;
    }
});
