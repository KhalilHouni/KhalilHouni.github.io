// Fonction qui va demander le nom au user
function askName() {
    // Demande le prénom au user avec un prompt()
    var nomUtilisateur = prompt("Entrez votre Prénom :");

    // Concatène la chaîne de caractères "👋 Bonjour" avec le prénom saisi par le user
    var messageBienvenue = "👋 Bonjour " + nomUtilisateur;

    // Retourne le message de bienvenue
    return messageBienvenue;
}

// Fonction pour demander la date de naissance au user et calculer l'âge précisément
function askBirthDate() {
    // Demande l'année de naissance au user en utilisant prompt()
    var anneeNaissance = prompt("Entrez votre année de naissance :");
    // Demande le mois de naissance au user (0-11 où 0 est janvier et 11 est décembre)
    var moisNaissance = prompt("Entrez votre mois de naissance (1-12) :") - 1;

    // Crée un objet Date pour la date actuelle
    var dateActuelle = new Date();
    // Crée un objet Date pour la date de naissance au user
    var dateNaissance = new Date(anneeNaissance, moisNaissance);

    // Calcule l'âge en soustrayant l'année de naissance à l'année actuelle
    var ageUtilisateur = dateActuelle.getFullYear() - dateNaissance.getFullYear();

    // Vérifie si le user n'a pas encore eu son anniversaire cette année, ajuste l'âge en conséquence
    if (dateActuelle.getMonth() < moisNaissance || (dateActuelle.getMonth() === moisNaissance && dateActuelle.getDate() < dateNaissance.getDate())) {
        ageUtilisateur--;
    }

    // Retourne le message : vous avez "age" ans
    return "Vous avez " + ageUtilisateur + " ans";
}

// Sélectionne le bouton par son ID
var startButton = document.getElementById('startButton');

// Sélectionne la div par son ID
var outputDiv = document.getElementById('output');

// Ajoute un gestionnaire d'événements pour le clic sur le bouton
startButton.addEventListener('click', function() {
    // Appelle la fonction pour demander le nom au user
    var messageBienvenue = askName();
    // Appelle la fonction pour demander la date de naissance au user et calcule l'âge
    var messageAge = askBirthDate();

    // Crée un élément de paragraphe pour afficher le résultat
    var resultParagraph = document.createElement('p');
    resultParagraph.textContent = "Ada : " + messageBienvenue + ", " + messageAge;

    // Ajoute le paragraphe à la div de sortie
    outputDiv.insertBefore(resultParagraph, outputDiv.firstChild);
});