# Bonjour, JavaScript! 👋

Semaine: 1
Compétence associée: -JS
-Variables
-Fonctions

Badge:
-Competence Variables et types
-Competence Structures conditionnelles
-Compétence fonctionnel
Contexte: Systèmes et réseau
Description: Une introduction au JavaScript et au traitement des entrées/sorties avec de la manipulation de variables et le découpage en fonctions.
L’exercice adopte un format guidé et vise à accompagner l’apprenant.e dans la construction d’un script JS qui va simplement afficher et traiter les saisies de l’utilisateur sur une page HTML.
Objectif: Découvrir le lien HTML+JS, manipuler des variables puis organiser son code en fonctions.
Prérequis outils: Télécharger le template page HTML+CSS+JS
Suivi Dorothy [Nantes]: Done 19.10
Suivi Dorothy [Paris]: Done 12.10
Suivi Doria [Nantes]: Done 9.02
Suivi Doris [Nantes]: Done le 07.06

Pensez à commiter votre solution aux problèmes posés dans cet exercice.
Si c’est votre premier exercice individuel, sur votre compte Github, créez un nouveau repository, appelez-le “ada-exercices-individuels”, dans lequel vous ajouterez un répertoire par exercice. Dans ce répertoire, vous pourrez déposer le fichier de l’énoncé ainsi que les sources de la solution que vous proposez.

- Langage : JS

# 1. Enoncé

Ce premier exercice individuel complétera votre introduction au code. Vous manipulerez des variables et des chaines de caractères.

Nous avons découpé l’exercice en étapes, il faut donc les suivre pour arriver au bout.
Le but n’étant pas forcément de tout faire mais d’essayer d’aller le plus loin, chacun peut aller à son rythme, ce n’est pas une compétition.

Pour commencer, vous pouvez télécharger le [template](https://github.com/adatechschool/exercices-individuels/raw/master/html_template.zip). Ce fichier zip contient une page HTML, une page web qu’un navigateur pourra afficher (en double cliquant dessus) ainsi qu’un fichier JavaScript (.JS), qui contiendra le corps de votre exercice. C’est ici que vous devrez écrire votre code. Vous le verrez plus en détail dans les fiches des prochaines semaines, mais le rôle du navigateur est d’afficher les pages HTML et d’exécuter le Javascript qu’elles contiennent.

*Contraintes:* 

- Suivre les étapes

## Étape 1: L’heure des présentations 🤝

Commencer par télécharger le template.

- Dans le fichier `script.js`, utilisez la fonction `prompt()` pour demander son nom à l’utilisateur.ice
- Créer une variable de texte dans laquelle vous utiliserez la concaténation pour stocker la chaine de caractère “👋 Bonjour” suivi du nom saisi par l’utilisateur.ice.
- Ajouter un element `h2` dans le corps de la page HTML qui entoure la chaine de caractères stockée.

Pour ajouter un élément au contenu de la page HTML, dans cet exercice, nous utiliserons le procédé suivant:
`document.body.innerHTML += '<h1> Coucou! </h1>’` notez l’usage de l’opérateur “+=” qui implique une addition au contenu existant dans la variable, ici `document.body.innerHTML`, qui correspond à notre page HTML.

## Étape 2: Faisons connaissance 😇

- À la suite de ce qui a été écrit dans l’étape 1, réutiliser le même procédé pour demander l’année de naissance de l’utilisateur.ice.
- Créer une variable qui contient l’age de l’utilisateur.ice, calculé à partir de son année de naissance et de l’année en cours.
- Sur la page HTML, ajouter un élément `h3` qui affiche “Vous avez ” suivi de l’age calculé précédemment suivi de “ans” (exemple: “Vous avez 32 ans”) toujours en employant les mêmes solutions employés en étape 1.

## Étape 3: Et un peu de ménage 🧹

À ce stade, le fichier JavaScript commence à contenir un petit paquet de lignes de code!

Organiser ce fichier, en découpant le code en fonction.

- Une première fonction que nous appellerons `askName()` qui contiendra le code de l’étape 1.
- Une seconde, `askBirthYear()` pour le code de l’étape 2

Ces deux fonctions, une fois définies, seront donc appelées, en bas de page.

C’est mieux ainsi, vous ne trouvez pas ?

## Étape bonus: Soyons précis, voulez-vous ? 🧐

Pour plus de précisions sur l’âge de notre utilisateur.ice, demandez-lui également son mois de naissance et prenez-le en compte dans le calcul.

# 2. Éléments de correction

```jsx
function askAge() {
	let name = prompt("Quel est votre nom ?");
	// Pensez à toujours controler les saisies des utilisateurs
	// Ici, je vais m'assurer d'avoir une réponse non-null.
	if (name != null) {
		// Je stock mon texte dans une variable que j'appelle "textName"
		let textName = '👋 Bonjour '+name;
		document.body.innerHTML += '<h2>'+textName+'</h2>';
	}
}

// J'applique les mêmes procédés que précédemment.
function askBirthYear() {
	let year = prompt("Quel est votre année de naissance ?");
	if (year != null) {
		let age = 2022-year;
		let textAge = 'Vous avez '+age+' ans';
		document.body.innerHTML += '<h3>'+textAge+'</h3>';
	}
}

// J'appelle les fonctions que je définis.
askAge();
askBirthYear();
```

