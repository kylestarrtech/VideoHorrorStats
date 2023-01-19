var pages = ["home", "teen", "monster", "sounds", "journey", "creatorhub", "weapons"]
var externalPages = ["https://vhs-lore.carrd.co/"]

var selectedPage = 0;

function HighlightButton(type) {
    document.getElementById(type + "RoleButton").src = 'public/images/header/' + type + '/highlighted.png';
}

function UnhighlightButton(type) {
    document.getElementById(type + "RoleButton").src = 'public/images/header/' + type + '/base.png';
}

function HighlightLogo(state) {
    if (state) { document.getElementById("MainLogo").src = 'public/images/logos/logo-small.png'; }
    else { document.getElementById("MainLogo").src = 'public/images/logos/logo-small-nofx.png'; }
}

function main() {
}

function MoveScriptsToHead() {
    var scripts = document.getElementsByClassName("bodyscript");
    for (var i = 0; i < scripts.length; i++) {
        document.head.appendChild(scripts[i]);
    }
}

function LoadSelectedPage() {
    window.location.assign(pages[selectedPage]);
}

function UpdateSelectedPage(index) {
    selectedPage = index;
    LoadSelectedPage();
}

function OpenExternalPage(index) {
    window.open(externalPages[index], "_blank");
}