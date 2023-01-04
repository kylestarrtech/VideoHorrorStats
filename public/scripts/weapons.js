const stigmaColors = ["#f2830040", "#fed90040", "#b500ff40", "#52deff40"]
const stigmaNames = ["Burn", "Purify", "Curse", "Shock"]
const stigmaIcons = [
    "public/images/stigmas/burn-white.png",
    "public/images/stigmas/purify-white.png",
    "public/images/stigmas/curse-white.png",
    "public/images/stigmas/shock-white.png",
]
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
var selectedWeaponModIndex = 0;

let storedWeaponData = undefined;

var cX = 0;
var cY = 0;

var tooltipTimeouts = []

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

    SetWeaponSwitchEvents();

    GetCategoryData(selectedWeaponIndex);
}

function SetWeaponSwitchEvents() {
    document.getElementById("flamethrower-btn").addEventListener('click', function() {
        UpdateSelectedCategory(0);
    });
    document.getElementById("firebomb-btn").addEventListener('click', function() {
        UpdateSelectedCategory(1);
    });
    document.getElementById("solarflare-btn").addEventListener('click', function() {
        UpdateSelectedCategory(2);
    });
    document.getElementById("radiantcross-btn").addEventListener('click', function() {
        UpdateSelectedCategory(3);
    });
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

function UpdateSelectedCategory(index) {
    selectedWeaponIndex = index;
    selectedWeaponModIndex = 0;

    GetCategoryData(selectedWeaponIndex);
}

function LoadCategory(selectedWeaponData) {
    let weaponStatsPanel = document.createElement("div");
    weaponStatsPanel.classList.add("weapon-stats-panel");
    
    contentPanel.innerHTML = "";
    contentPanel.appendChild(weaponStatsPanel);

    storedWeaponData = selectedWeaponData;
    GenerateWeaponStats(selectedWeaponData, weaponStatsPanel);
}

function GenerateWeaponStats(weaponData, weaponStatsPanel) {
    weaponStatsPanel.appendChild(GenerateWeaponTitle(weaponData));

    weaponStatsPanel.appendChild(GenerateWeaponBaseStats(weaponData));

    weaponStatsPanel.appendChild(GenerateWeaponDetailedStats(weaponData));
    
    weaponStatsPanel.appendChild(GenerateWeaponMods(weaponData));

    LoadSelectedModData();
}

function GenerateWeaponTitle(weaponData) {
    let titleText = document.createElement("div");
    titleText.classList.add("weapon-title-text");

    let stigmaImg = document.createElement("img");
    stigmaImg.classList.add("weapon-stigma-img");
    stigmaImg.draggable = false;
    stigmaImg.src = stigmaIcons[weaponData.StigmaID];

    titleText.appendChild(stigmaImg);

    let weaponTitle = document.createElement("h1");
    weaponTitle.classList.add("TeenTitle");
    weaponTitle.innerText = weaponData.Name;
    weaponTitle.style.textTransform = "uppercase";

    titleText.appendChild(weaponTitle);

    return titleText;
}

function GenerateWeaponBaseStats(weaponData) {
    let baseStatsPanel = document.createElement("div");
    baseStatsPanel.classList.add("weapon-base-stats-panel");

    let weaponThumbnail = document.createElement("div");
    weaponThumbnail.classList.add("weapon-thumbnail");
    
    let weaponImg = document.createElement("img");
    weaponImg.src = weaponData.IconPath;
    weaponImg.draggable = false;

    weaponThumbnail.appendChild(weaponImg);
    baseStatsPanel.appendChild(weaponThumbnail);


    let statsCategory = document.createElement("div");
    statsCategory.classList.add("weapon-statscategory");

    let header = document.createElement("h1");
    header.classList.add("weapon-stats-subtitle");
    header.innerText = "BASE STATS";

    statsCategory.appendChild(header);


    let description = document.createElement("div");
    description.classList.add("weapon-description");
    
    let descriptionText = document.createElement("p");
    descriptionText.innerText = weaponData.Description;

    description.appendChild(descriptionText);

    statsCategory.appendChild(description);

    statsCategory.appendChild(GenerateStatsTable(weaponData.BaseStats));

    baseStatsPanel.appendChild(statsCategory);

    return baseStatsPanel;
}

function GenerateStatsTable(statsList) {
    let statsTable = document.createElement("div");
    statsTable.classList.add("stats-table");

    for (let i = 0; i < statsList.length; i++) {
        let currentStat = statsList[i];

        let statsContainer = document.createElement("div");
        statsContainer.classList.add("weapon-stat-container");
        
        if (currentStat.Misc.ToolTip != "") {
            statsContainer.addEventListener('mouseenter', function() {
                ShowToolTip(currentStat.Misc.ToolTip);
            });

            statsContainer.addEventListener('mouseleave', function() {
                HideToolTip();
            })
        }
        
        let statDescriptor = document.createElement("div");
        statDescriptor.classList.add("weapon-stat-descriptor");
        statDescriptor.innerText = statsList[i].Name + ":";

        statsContainer.appendChild(statDescriptor);


        let statsNumber = document.createElement("div");
        statsNumber.classList.add("weapon-stat-number");

        if (statsList[i].Misc.Suffix != "") {
            statsNumber.innerText = `${statsList[i].Value}${statsList[i].Unit} (${statsList[i].Misc.Suffix})`;
        } else {
            statsNumber.innerText = `${statsList[i].Value}${statsList[i].Unit}`;
        }

        statsContainer.appendChild(statsNumber);


        statsTable.appendChild(statsContainer);
    }

    return statsTable;
}

function GenerateWeaponDetailedStats(weaponData) {
    let detailedStatsDiv = document.createElement("div");
    detailedStatsDiv.classList.add("weapon-statscategory");

    let categoryTitle = document.createElement("div");
    categoryTitle.classList.add("weapon-stats-subtitle");
    categoryTitle.innerText = "DETAILED STATISTICS";
    
    detailedStatsDiv.appendChild(categoryTitle);


    let headerDivider = document.createElement("hr");
    headerDivider.classList.add("headerDivider");

    detailedStatsDiv.appendChild(headerDivider);


    let weaponDescription = document.createElement("div");
    weaponDescription.classList.add("weapon-description");

    let descriptionText = document.createElement("p");
    descriptionText.innerText = `Below are more intricate stats on the ${weaponData.Name} that are not readily available in-game:`;

    weaponDescription.appendChild(descriptionText);

    detailedStatsDiv.appendChild(weaponDescription);

    detailedStatsDiv.appendChild(GenerateStatsTable(weaponData.DetailedStats));

    return detailedStatsDiv;
}

function GenerateWeaponMods(weaponData) {
    let weaponModCategory = document.createElement("div");
    weaponModCategory.classList.add("weapon-statscategory");
    weaponModCategory.id = "weapon-mod-main-category";

    let weaponTitle = document.createElement("h1");
    weaponTitle.classList.add("weapon-stats-subtitle");
    weaponTitle.innerText = "WEAPON MODS";

    weaponModCategory.appendChild(weaponTitle);
    

    let headerDivider = document.createElement("hr");
    headerDivider.classList.add("headerDivider");

    weaponModCategory.appendChild(headerDivider);

    
    let weaponDescContainer = document.createElement("div");
    weaponDescContainer.classList.add("weapon-description");

    let weaponDescParagraph = document.createElement("p");
    weaponDescParagraph.innerText = "Select a mod below to view detailed weapon statistics on it:";

    weaponDescContainer.appendChild(weaponDescParagraph);
    weaponModCategory.appendChild(weaponDescContainer);


    let weaponModFlex = document.createElement("div");
    weaponModFlex.classList.add("weapon-mod-flex");
    weaponModFlex.id = "weapon-mod-flex-container";

    for (let i = 0; i < weaponData.WeaponMods.length; i++) {
        let currentModIndex = i;
        let currentMod = weaponData.WeaponMods[i]

        let weaponModButton = document.createElement("button");
        weaponModButton.classList.add("weapon-mod-button");

        if (selectedWeaponModIndex == i) {
            weaponModButton.classList.add("selected-weapon-mod");
        }

        
        let weaponModImg = document.createElement("img");
        weaponModImg.src = currentMod.IconPath;
        weaponModImg.draggable = false;

        weaponModButton.appendChild(weaponModImg);

        weaponModButton.addEventListener('click', function() {
            UpdateSelectedMod(currentModIndex);
        });

        weaponModFlex.appendChild(weaponModButton);
    }

    weaponModCategory.appendChild(weaponModFlex);

    return weaponModCategory;
}

function LoadSelectedModData() {
    let selectedMod = storedWeaponData.WeaponMods[selectedWeaponModIndex];

    let selModContainer = document.createElement("div");
    selModContainer.classList.add("weapon-statscategory");
    selModContainer.classList.add("weapon-mod-container");
    selModContainer.id = "selected-mod-info-container";


    let modTitle = document.createElement("div");
    modTitle.classList.add("weapon-title-text");

    let modImg = document.createElement("img");
    modImg.classList.add("weapon-stigma-img");
    modImg.classList.add("weapon-mod-stats-icon");
    modImg.src = selectedMod.IconPath;
    modImg.draggable = false;

    modTitle.appendChild(modImg);


    let modText = document.createElement("h1");
    modText.classList.add("TeenTitle");
    modText.style.textTransform = "uppercase";
    modText.innerText = selectedMod.Name;

    modTitle.appendChild(modText);


    let modLevel = document.createElement("h1");
    modLevel.classList.add("weapon-mod-level");
    modLevel.innerText = `LEVEL ${selectedMod.Level}`;

    modTitle.appendChild(modLevel);


    selModContainer.appendChild(modTitle);


    let headerDivider = document.createElement("hr");
    headerDivider.classList.add("headerDivider");

    selModContainer.appendChild(headerDivider);


    let weaponGridContainer = document.createElement("div");
    weaponGridContainer.classList.add("weapon-mod-stats-grid-container");


    let modDescContainer = document.createElement("div");
    modDescContainer.classList.add("weapon-mod-description-container");

    let modDescTitle = document.createElement("div");
    modDescTitle.classList.add("weapon-stats-subtitle");
    modDescTitle.innerText = "DESCRIPTION";

    modDescContainer.appendChild(modDescTitle);

    let modDescDescription = document.createElement("p");
    modDescDescription.classList.add("weapon-mod-description");
    modDescDescription.innerHTML = selectedMod.Description;

    modDescContainer.appendChild(modDescDescription);

    weaponGridContainer.appendChild(modDescContainer);


    let modStatsContainer = document.createElement("div");
    modStatsContainer.classList.add("weapon-mod-stats-container");

    let modStatsTitle = document.createElement("div");
    modStatsTitle.classList.add("weapon-stats-subtitle");
    modStatsTitle.innerText = "STATISTICS";

    modStatsContainer.appendChild(modStatsTitle);


    let modStatsBr = document.createElement("br");
    
    modStatsContainer.appendChild(modStatsBr);

    modStatsContainer.appendChild(GenerateStatsTable(selectedMod.Stats));

    weaponGridContainer.appendChild(modStatsContainer);

    selModContainer.appendChild(weaponGridContainer);

    document.getElementById("weapon-mod-main-category").appendChild(selModContainer);
}

function UpdateSelectedMod(newVal) {
    document.getElementById("selected-mod-info-container").remove();

    let modIcons = document.getElementById("weapon-mod-flex-container").childNodes;

    for (let i = 0; i < modIcons.length; i++) {
        modIcons[i].classList.remove("selected-weapon-mod");

        if (i == newVal) {
            modIcons[i].classList.add("selected-weapon-mod");
        }
    }

    selectedWeaponModIndex = newVal;
    LoadSelectedModData();
}

function getCursorPosition(event) {
    cX = event.clientX;
    cY = event.clientY;

    UpdateToolTipPosition();
}

function UpdateToolTipPosition() {
    let tooltip = document.getElementById("ToolTip");

    tooltip.style.top = (cY + 5 + document.documentElement.scrollTop) + "px";
    tooltip.style.left = (cX + 5) + "px";

    let width = tooltip.clientWidth;
    if (cX + width + 25 > window.innerWidth) {
        tooltip.style.left = (window.innerWidth - width - 25) + "px";
    }
}

function ShowToolTip(tooltipText) {
    let tooltip = document.getElementById("ToolTip");

    for (var i = 0; i < tooltipTimeouts.length; i++) {
        clearTimeout(tooltipTimeouts[i]);
    }

    tooltipTimeouts = [];

    tooltip.innerHTML = tooltipText;
    tooltip.hidden = false;
    tooltip.style.opacity = 1;
}

function HideToolTip() {
    let tooltip = document.getElementById("ToolTip");
    tooltip.style.opacity = 0;
    tooltipTimeouts.push(setTimeout(function() {
        tooltip.hidden = true;
    }, 1000));
}