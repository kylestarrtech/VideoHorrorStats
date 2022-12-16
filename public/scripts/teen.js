var contentPanel;
var categories = ["data/stats/teen/characters/gloria.json", "data/stats/teen/characters/brett.json", "data/stats/teen/characters/leo.json", "data/stats/teen/characters/jess.json", "data/stats/teen/characters/faith.json", "data/stats/teen/actions.json", "data/stats/teen/comms.json", "data/stats/teen/healing.json", "data/stats/teen/movement.json", "data/stats/teen/characters/reggie.json"]

var perksPath = "data/stats/perks_and_mutations.json";
var perks;

var selectedCategoryIndex = 0;

var tooltipTimeouts = []

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function mainTeen() {
    contentPanel = document.getElementById("contentpanel");
    console.log("Found contentpanel! Beginning category loading...");
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('categoryID')) {
        let proposedIndex = parseInt(urlParams.get('categoryID'));
        if (proposedIndex < 0 || proposedIndex >= categories.length) {
            proposedIndex = 0;
        }
        selectedCategoryIndex = proposedIndex;
    }

    GetPerks();
    GetCategoryData(selectedCategoryIndex);
}

function GetPerks() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            perks = JSON.parse(xhttp.responseText);
        }
    }
    xhttp.open("GET", perksPath, false);
    xhttp.send();
}

function UpdateParameters() {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?categoryID=' + selectedCategoryIndex;
    window.history.pushState({path:newurl},'',newurl);
}

function UpdateSelectedCategory(index) {
    selectedCategoryIndex = index;
    GetCategoryData(selectedCategoryIndex);
    UpdateParameters();
}

function GetCategoryData(index) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            LoadCategory(JSON.parse(xhttp.responseText));
        }
    }
    xhttp.open("GET", categories[index], false);
    xhttp.send()
}

function LoadCategory(categoryData) {
    console.log(categoryData);
    console.log(categoryData.Type);
    if (categoryData.Type == "STATSCATEGORY") {
            contentPanel.innerHTML = 
            "<div class='StatsCategory'>" +
                "<h1 class='StatsTitle'>" + categoryData.Name + "</h1>" +
                "<hr class='StatsDivisor'>" + 
                "<h4 class='CategoryDescription'>" + categoryData.Description + "</p>" + GetStats(categoryData);
    } else if (categoryData.Type == "CHARACTER") {
        LoadTeenData(categoryData);
    }
}

function LoadTeenData(categoryData) {
    let finalStr = "";

    finalStr += "<div class='StatsCategory'>";

    finalStr += "<div class='TeenImageParent'><img class='TeenImage' src='" +
    categoryData.Icon + "'></div>";

    finalStr += "<h1 class='TeenTitle'><u>" + categoryData.Name + "</u></h1>";
    finalStr += "<h2 class='TeenQuote'><u>" + categoryData.Quote + "</u></h2>";
    finalStr += "<div class='TeenStatsCategory'>" +
        "<h2 class='StatsTitle'>INFO</h2>" +
        "<hr class='StatsDivisor'>";
        
    finalStr += "<h3 class='CharAge'>AGE: " + categoryData.Age + "</h3>";

    finalStr += "<div class='PotentialContainer'><div class='PotentialIconContainer'><img class='PotentialIcon' src='" +
    categoryData.PotentialIcon + "'></div><h3 class='Potential'>" + categoryData.Potential + "</h3></div>";


    finalStr += "<div class='LoreContainer StatsCategory'><h3 class='LoreHeader'>" +
        "ABOUT " + categoryData.Pronouns[1].toUpperCase() + ":</h3>";
    
    finalStr += "<span class='LoreDescription'>" + categoryData.Description + "</span></div>";

    
    finalStr += "</div>"

    finalStr += "<h2 class='CharSectionHeader'>PERKS</h2>" +
        "<hr class='StatsDivisor'>";

    finalStr += "<table class='PerkTable'><tbody class='PerkTable'><tr class='PerkRow'>";

    for (var perk of categoryData.Perks) {
        let perkData = perks[perk];

        finalStr += "<td>";

        finalStr += "<img src='" + perkData.Icon + "' class='PerkImage'>";
        finalStr += "<h2 class='PerkTitle'>" + perkData.Name + "</h2><hr class='StatsDivisor'>";
        
        finalStr += "<div class='PerkDescriptionContainer'><span class='PerkDescription'>" + perkData.Description + "</span></div>"

        finalStr += "</td>"
            
    }

    finalStr += "</tr></tbody></table>";


    contentPanel.innerHTML = finalStr;
}

function GetStats(categoryData) {
    let finalStr = "";
    for (var subcategory of categoryData.StatCategories) {
        finalStr += "<h2 class='StatsSubcategory'>" + subcategory.Name + "</h2>";
        for (var stat of subcategory.Stats) {
            finalStr += "<p class='StatDescriptor'";
            
            if (stat.Misc.ToolTip) {
                finalStr += " onmouseenter='ShowToolTip(\"" + stat.Misc.ToolTip + "\");' onmouseleave='HideToolTip();'";
            }

            finalStr += ">" + stat.Name + 
                ": <span class='StatNumber'>" + stat.Value + stat.Unit;
            if (stat.Misc.Suffix) {
                finalStr += " " + stat.Misc.Suffix;
            }

            finalStr += "</span></p>";
        }
    }
    return finalStr;
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
}

function ShowToolTip(tooltipText) {
    let tooltip = document.getElementById("ToolTip");

    for (var i = 0; i < tooltipTimeouts.length; i++) {
        clearTimeout(tooltipTimeouts[i]);
    }

    tooltipTimeouts = [];

    tooltip.innerText = tooltipText;
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