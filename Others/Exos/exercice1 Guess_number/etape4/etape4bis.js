let numberToGuessPlayer1;
let numberToGuessPlayer2;

document.getElementById("player1Button").addEventListener("click", function() {
    numberToGuessPlayer1 = demanderNombreADeviner();
    alert("Player 1, vous avez choisi le nombre à deviner. C'est au tour de Player 2 de deviner !");
});

document.getElementById("player2Button").addEventListener("click", function() {
    numberToGuessPlayer2 = demanderNombreADeviner();

    let guessedNumberPlayer2 = parseInt(prompt("Player 2, devinez le nombre de Player 1:"));
    if (guessedNumberPlayer2 === numberToGuessPlayer1) {
        alert("Bravo ! Le joueur 2 a deviné le nombre de Player 1.");
    } else {
        alert("Désolé, le joueur 2 n'a pas deviné le nombre de Player 1. Le nombre à deviner était : " + numberToGuessPlayer1);
    }

    let guessedNumberPlayer1 = parseInt(prompt("Player 1, devinez le nombre de Player 2:"));
    if (guessedNumberPlayer1 === numberToGuessPlayer2) {
        alert("Bravo ! Le joueur 1 a deviné le nombre de Player 2.");
    } else {
        alert("Désolé, le joueur 1 n'a pas deviné le nombre de Player 2. Le nombre à deviner était : " + numberToGuessPlayer2);
    }
});

// Fonction pour demander un nombre au joueur à deviner entre 0 et 50
function demanderNombreADeviner() {
    let numberToGuess;
    do {
        numberToGuess = parseInt(prompt("Veuillez entrer un nombre à deviner entre 0 et 50 :"));
    } while (isNaN(numberToGuess) || numberToGuess < 0 || numberToGuess > 50);
    return numberToGuess;
}
