function didIWin(givenNumber) {
    if (givenNumber < 22) {
        alert("Plus grand");
    } else if (givenNumber > 22) {
        alert("Plus petit");
    } else {
        alert("Bravo ! Vous avez deviné le nombre");
    }
}

var givenNumber = prompt("Entrez un nombre :");
didIWin(givenNumber);
