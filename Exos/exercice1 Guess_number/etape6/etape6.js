var numberToGuess = Math.floor(Math.random() * 51);
var minRange = 0;
var maxRange = 50;
var attempts = 0;

function checkGuess() {
    var userGuess = document.getElementById("userGuess").value.trim().toLowerCase(); // Convertir l'entrée en minuscules
    var messageElement = document.getElementById("message");
    var attemptsElement = document.getElementById("attempts");

    //  Cheat code :voir le nombre à deviner dans la console
    console.log("CHEAT CODE ACTIVATED :Le nombre à deviner est : " + numberToGuess);

    userGuess = parseInt(userGuess); // Convertir l'entrée en nombre

    if (isNaN(userGuess) || userGuess < minRange || userGuess > maxRange) {
        messageElement.textContent = "Veuillez entrer un nombre valide dans le range actuel (" + minRange + " - " + maxRange + ").";
    } else {
        attempts++;
        attemptsElement.textContent = attempts;

        if (userGuess < numberToGuess) {
            minRange = userGuess;
            messageElement.textContent = "Plus grand. Range actuel : " + minRange + " < ? < " + maxRange;
        } else if (userGuess > numberToGuess) {
            maxRange = userGuess;
            messageElement.textContent = "Plus petit. Range actuel : " + minRange + " < ? < " + maxRange;
        } else {
            messageElement.textContent = "Bravo ! Vous avez deviné le nombre.";
            numberToGuess = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
            attempts = 0;
            attemptsElement.textContent = attempts;
            minRange = 0;
            maxRange = 51; // Ajustez maxRange à 51 pour permettre à l'utilisateur d'entrer 51
        }
    }
}


