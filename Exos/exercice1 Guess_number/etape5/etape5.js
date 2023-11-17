// Générer un nombre aléatoire entre 0 et 50
var numberToGuess = Math.floor(Math.random() * 51);
var attempts = 0; // Compteur de tentatives

function checkGuess() {
    var userGuess = parseInt(document.getElementById("userGuess").value);
    var messageElement = document.getElementById("message");
    var attemptsElement = document.getElementById("attempts");

    if (isNaN(userGuess) || userGuess < 0 || userGuess > 50) {
        messageElement.textContent = "Veuillez entrer un nombre valide entre 0 et 50.";
    } else {
        attempts++;
        attemptsElement.textContent = attempts;

        if (userGuess < numberToGuess) {
            messageElement.textContent = "Plus grand";
        } else if (userGuess > numberToGuess) {
            messageElement.textContent = "Plus petit";
        } else {
            messageElement.textContent = "Bravo ! Vous avez deviné le nombre.";
            // Réinitialiser le jeu en générant un nouveau nombre à deviner
            numberToGuess = Math.floor(Math.random() * 51);
            attempts = 0;
            attemptsElement.textContent = attempts;
        }
    }
}
