function demanderNombre() {
    var givenNumber = prompt("Entrez un nombre :");
    return parseInt(givenNumber);
}

function didIWin(givenNumber) {
    if (givenNumber < 22) {
        alert("Plus grand");
        return false;
    } else if (givenNumber > 22) {
        alert("Plus petit");
        return false;
    } else {
        alert("Bravo ! Vous avez deviné le nombre");
        return true;
    }
}

function gamePlay() {
    var win = false;
    while (!win) {
        var givenNumber = demanderNombre();
        win = didIWin(givenNumber);
    }
}
