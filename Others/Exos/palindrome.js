// Étape 1
function maxDaysInMonth(month, year) {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0))) {
        return 29; // February in a leap year
    }
    return daysInMonth[month - 1];
}

function isValidDate(dateString) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(regex);

    if (!match) {
        return false; // Format incorrect
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    if (month < 1 || month > 12 || day < 1 || day > maxDaysInMonth(month, year)) {
        return false; // Date invalide
    }

    return true;
}

// Étape 2
function isPalindrome(str) {
    const cleanStr = str.replace(/\//g, ''); // Supprimer les caractères '/'
    return cleanStr === cleanStr.split('').reverse().join('');
}

function isDatePalindrome(dateString) {
    if (!isValidDate(dateString)) {
        return false; // Date invalide
    }

    return isPalindrome(dateString);
}

// Étape 3
function getNextPalindromes(x) {
    const today = new Date();

    while (x > 0) {
        today.setDate(today.getDate() + 1);
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        if (isDatePalindrome(formattedDate)) {
            console.log(formattedDate);
            x--;
        }
    }
}

// Étape 4
function isPalindromeString(str) {
    const cleanStr = str.replace(/\//g, ''); // Supprimer les caractères '/'
    return cleanStr === cleanStr.split('').reverse().join('');
}

function isDatePalindromeRefactored(dateString) {
    if (!isValidDate(dateString)) {
        return false; // Date invalide
    }

    return isPalindromeString(dateString);
}

// Exemples d'utilisation
console.log(isValidDate("03/04/2001")); // true
console.log(isValidDate("03/14/2001")); // false
console.log(isPalindrome("11/02/2011")); // true
console.log(isPalindrome("03/04/2001")); // false

getNextPalindromes(8);
