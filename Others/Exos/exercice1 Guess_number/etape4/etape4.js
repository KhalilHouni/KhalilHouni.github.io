// Fonction pour demander un nombre au joueur 1 à deviner entre 0 et 50
function demanderNombreADeviner() {
    let numberToGuess;
    do {
        numberToGuess = parseInt(prompt("Joueur 1, veuillez entrer un nombre à deviner entre 0 et 50 :"));
    } while (isNaN(numberToGuess) || numberToGuess < 0 || numberToGuess > 50);
    return numberToGuess;
}

// Fonction pour demander au joueur 2 de deviner le nombre du joueur 1
function devinerNombre(numberToGuess) {
    let userNumber;
    do {
        userNumber = parseInt(prompt("Joueur 2, devinez le nombre :"));
    } while (isNaN(userNumber) || userNumber < 0 || userNumber > 50);

    return userNumber === numberToGuess; // Retourne true si le joueur 2 a deviné correctement, sinon false
}

// Fonction pour gérer le gameplay avec deux joueurs
function gamePlay() {
    const numberToGuess = demanderNombreADeviner();

    if (devinerNombre(numberToGuess)) {
        alert("Bravo ! Vous avez deviné le nombre.");
    } else {
        alert("Désolé, vous n'avez pas deviné le nombre. Le nombre à deviner était : " + numberToGuess);
    }
}

// Appeler la fonction pour commencer le jeu
gamePlay();
