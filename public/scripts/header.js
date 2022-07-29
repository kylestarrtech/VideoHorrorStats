var pages = ["home", "teen", "monster", "sounds", "journey"]
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
    console.log("Loaded!");
    //LoadSelectedPage();
}

function MoveScriptsToHead() {
    var scripts = document.getElementsByClassName("bodyscript");
    for (var i = 0; i < scripts.length; i++) {
        document.head.appendChild(scripts[i]);
    }
}

function LoadSelectedPage() {
    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         let contentPanel = document.getElementById("contentpanel");
    //         contentPanel.innerText = "";
    //         contentPanel.innerHTML = xhttp.responseText;
    //         //MoveScriptsToHead();
    //         //console.log("Scripts moved!");
    //     }
    // }
    // xhttp.open("GET", pages[selectedPage]);
    // xhttp.send();
    // console.log("Sent!");
    window.location.assign(pages[selectedPage]);
}

function UpdateSelectedPage(index) {
    selectedPage = index;
    LoadSelectedPage();
}