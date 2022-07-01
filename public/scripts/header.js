var pages = ["home", "teens", "monsters", "sounds"]
var selectedPage = 0;

function HighlightButton(type) {
    document.getElementById(type + "RoleButton").src = 'public/images/header/' + type + '/highlighted.png';
}

function UnhighlightButton(type) {
    document.getElementById(type + "RoleButton").src = 'public/images/header/' + type + '/base.png';
}

function main() {
    console.log("Loaded!");
    LoadSelectedPage();
}

function LoadSelectedPage() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let contentPanel = document.getElementById("contentpanel");
            contentPanel.innerText = "";
            contentPanel.innerHTML = xhttp.responseText;
        }
    }
    xhttp.open("GET", pages[selectedPage]);
    xhttp.send();
    console.log("Sent!");
}

function UpdateSelectedPage(index) {
    selectedPage = index;
    LoadSelectedPage();
}