// Étape 1
function maxDaysInMonth(month, year) {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))) {
        return 29; // February in a leap year
    }
    return daysInMonth[month - 1];
}

function isValidDate(dateString) {
    const parts = dateString.split('/');
    
    if (parts.length !== 3) {
        return false; // La date ne contient pas trois parties séparées par des barres obliques
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return false; // Les parties ne sont pas toutes des nombres
    }

    if (month < 1 || month > 12 || day < 1 || day > maxDaysInMonth(month, year)) {
        return false; // Date invalide
    }

    return true;
}


console.log(isValidDate("03/04/2001")); // true
console.log(isValidDate("03/14/2001")); // false


// Étape 2
function isPalindrome(str) {
    const cleanStr = str.replace(/\//g, ''); // Supprimer les caractères '/'
    const reversedStr = cleanStr.split('').reverse().join('');
    return cleanStr === reversedStr;

}


console.log(isPalindrome("11/02/2011")); // true
console.log(isPalindrome("03/04/2001")); // false


// Étape 3
function getNextPalindromes(x) {
    const today = new Date();

    while (x > 0) {
        today.setDate(today.getDate() + 1);
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        if (isPalindrome(formattedDate)) {
            console.log(formattedDate);
            x--;
        }
    }
}

// Exemple d'utilisation
getNextPalindromes(8);

// Etape 4 (mettre en commente l'etape 2)
// Fonction générale pour vérifier si une chaîne est un palindrome
function isPalindrome2(str) {
    const cleanStr = str.replace(/\//g, ''); // Supprimer les caractères '/'
    const reversedStr = cleanStr.split('').reverse().join('');
    return cleanStr === reversedStr;
}

// Fonction spécifique pour vérifier si une date est un palindrome
function isDatePalindrome(dateString) {
    if (!isValidDate(dateString)) {
        return false; // Date invalide
    }

    return isPalindrome2(dateString);
}

// Exemples d'utilisation
console.log(isPalindrome2("kayak")); // true
console.log(isDatePalindrome("11/02/2011")); // true
console.log(isDatePalindrome("03/04/2001")); // false
