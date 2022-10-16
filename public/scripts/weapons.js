const stigmaColors = ["#f2830040", "#fed90040", "#b500ff40", "#52deff40"]
const stigmaNames = ["Burn", "Purify", "Curse", "Shock"]
const weaponPaths = [
    "data/stats/weapons/burn/flamethrower.json",
    "data/stats/weapons/burn/firebomb.json",
    "data/stats/weapons/burn/solarflare.json",
    "data/stats/weapons/purify/radiantcross.json",
    "data/stats/weapons/purify/holyslingshot.json",
    "data/stats/weapons/purify/sacredstaff.json",
    "data/stats/weapons/curse/cursedsword.json",
    "data/stats/weapons/curse/infernaleye.json",
    "data/stats/weapons/curse/enigma.json",
    "data/stats/weapons/shock/raygun.json",
    "data/stats/weapons/shock/rccopter.json",
    "data/stats/weapons/shock/shocksphere.json",
]
const weaponCap = 3

var contentPanel;

var selectedWeaponIndex = 0;

var cX = 0;
var cY = 0;

function mainWeapons() {
    contentPanel = document.getElementById("contentpanel");
    console.log("Found contentpanel! Beginning category loading...");

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('weaponID')) {
        let proposedIndex = parseInt(urlParams.get('weaponID'));
        if (proposedIndex < 0 || proposedIndex >= weaponCap) {
            proposedIndex = 0;
        }
        selectedWeaponIndex = proposedIndex;
    }

    GetCategoryData(selectedWeaponIndex);
}

function GetCategoryData(index) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            LoadCategory(JSON.parse(xhttp.responseText));
        }
    }
    xhttp.open("GET", weaponPaths[index], false);
    xhttp.send();
}

function LoadCategory(selectedWeaponData) {
    contentPanel.innerHTML = "<div class='StatsCategory' id='MAINSTATSCATEGORY' style='background-color:" + stigmaColors[selectedWeaponData.Stigma_ID] + ";'>" + GenerateWeaponStats(selectedWeaponData);
}

function GenerateWeaponStats(weaponData) {
    var finalStr = "";

    finalStr += "<div class='TeenImageParent'>" +
        "<img class='StigmaImage' src='public/images/stigmas/" + weaponData.Stigma + "_white.png'>" +
        "<img class='TeenImage' src='" + weaponData.Icon + "'>" +
        "</div>";

    finalStr += "<h1 class='TeenTitle'><u>" + weaponData.Stigma.toUpperCase() + "/" + weaponData.Name.toUpperCase() + "</u></h1>" +
    "<hr class='StatsDivisor'>" +
    "<h2 class='WeaponStatsHeader'>BASE STATS</h2>"

    finalStr += "<div class='WeaponCategory' style='background-color:" + stigmaColors[weaponData.Stigma_ID] + ";'>" +
    "a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>a<br>" +
    "</div>"
    return finalStr;
}