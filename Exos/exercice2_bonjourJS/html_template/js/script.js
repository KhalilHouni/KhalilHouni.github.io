// Fonction pour demander le nom à l'utilisateur.ice
function askName() {
    // Demande le nom à l'utilisateur.ice en utilisant prompt()
    var nomUtilisateur = prompt("Entrez votre nom :");

    // Concatène la chaîne de caractères "👋 Bonjour" avec le nom saisi par l'utilisateur.ice
    var messageBienvenue = "👋 Bonjour " + nomUtilisateur;

    // Ajoute un élément h2 contenant le message de bienvenue à la page HTML
    document.body.innerHTML += '<h2>' + messageBienvenue + '</h2>';
}

// Fonction pour demander la date de naissance à l'utilisateur.ice et calculer l'âge précisément
function askBirthDate() {
    // Demande l'année de naissance à l'utilisateur.ice en utilisant prompt()
    var anneeNaissance = prompt("Entrez votre année de naissance :");
    // Demande le mois de naissance à l'utilisateur.ice (0-11 où 0 est janvier et 11 est décembre)
    var moisNaissance = prompt("Entrez votre mois de naissance (1-12) :") - 1;

    // Crée un objet Date pour la date actuelle
    var dateActuelle = new Date();
    // Crée un objet Date pour la date de naissance de l'utilisateur.ice
    var dateNaissance = new Date(anneeNaissance, moisNaissance);

    // Calcule l'âge en soustrayant l'année de naissance de l'année actuelle
    var ageUtilisateur = dateActuelle.getFullYear() - dateNaissance.getFullYear();

    // Vérifie si l'utilisateur.ice n'a pas encore eu son anniversaire cette année, ajuste l'âge en conséquence
    if (dateActuelle.getMonth() < moisNaissance || (dateActuelle.getMonth() === moisNaissance && dateActuelle.getDate() < dateNaissance.getDate())) {
        ageUtilisateur--;
    }

    // Concatène la chaîne de caractères "Vous avez " avec l'âge de l'utilisateur.ice et " ans"
    var messageAge = "Vous avez " + ageUtilisateur + " ans";

    // Ajoute un élément h3 contenant le message d'âge à la page HTML
    document.body.innerHTML += '<h3>' + messageAge + '</h3>';
}

// Sélectionne le bouton par son ID
var startButton = document.getElementById('startButton');

// Ajoute un gestionnaire d'événements pour le clic sur le bouton
startButton.addEventListener('click', function() {
    // Appelle la fonction pour demander le nom à l'utilisateur.ice
    askName();
    // Appelle la fonction pour demander la date de naissance à l'utilisateur.ice et calculer l'âge
    askBirthDate();
});