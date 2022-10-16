var contentPanel;
var categories = ["data/stats/monster/werewolf.json", "data/stats/monster/wart.json", "data/stats/monster/dollmaster.json", "data/stats/monster/deathwire.json"]

var perksPath = "data/stats/perks_and_mutations.json";
var perks;

var selectedCategoryIndex = 0;

var cX = 0;
var cY = 0;

var tooltipTimeouts = []

function mainMonster() {
    contentPanel = document.getElementById("contentpanel");
    console.log("Found contentpanel! Beginning category loading...");

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('monsterID')) {
        let proposedIndex = parseInt(urlParams.get('monsterID'));
        if (proposedIndex < 0 || proposedIndex >= categories.length) {
            proposedIndex = 0;
        }
        selectedCategoryIndex = proposedIndex;
    }

    GetPerks();
    GetCategoryData(selectedCategoryIndex);
}

function GetCategoryData(index) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            LoadCategory(JSON.parse(xhttp.responseText));
        }
    }
    xhttp.open("GET", categories[index], false);
    xhttp.send();
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

function LoadCategory(categoryData) {
    contentPanel.innerHTML = "<div class='StatsCategory' id='MAINSTATSCATEGORY'>" + GenerateStatsPage(categoryData);
    BuildMutations(categoryData);
}

function UpdateParameters() {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?monsterID=' + selectedCategoryIndex;
    window.history.pushState({path:newurl},'',newurl);
}

function UpdateSelectedCategory(index) {
    selectedCategoryIndex = index;
    GetCategoryData(selectedCategoryIndex);
    UpdateParameters();
}

function BuildMutations(categoryData) {
    console.log(categoryData);
    console.log(categoryData.Mutations);
    for (var mutation of categoryData.Mutations) {
        console.log(mutation.PowerID);
        let powerTarget = document.getElementById("MUTATIONTABLEROW" + mutation.PowerID);

        let finalStr = "";

        finalStr += "<td><div>" +
        "<img class='MutationImage' src='" + mutation.Icon + "'>" +
        "<h2 class='StatsTitle'>" + mutation.Name + "</h2>" +
        "<hr class='StatsDivisor'>";

        for (var mutationStat of mutation.Stats) {
            finalStr += "<p class='StatsDescriptor' ";

            if (mutationStat.Misc.ToolTip) {
                finalStr += "onmouseenter=\"ShowToolTip('" + mutationStat.Misc.ToolTip + "')\"" +
                            "onmouseleave='HideToolTip()'";
            }
    
            finalStr += ">" + mutationStat.Name +
                ": <span class='StatsNumber'>" + mutationStat.Value + mutationStat.Unit;
            if (mutationStat.Misc.Suffix) {
                finalStr += " " + mutationStat.Misc.Suffix;
            }
    
            finalStr += "</span></p>";    
        }

        powerTarget.innerHTML += finalStr;
    }
}

function GenerateStatsPage(categoryData) {
    var finalStr = "";

    finalStr += "<div class='MonsterImageParent'><img class='MonsterImage' src='" + 
        categoryData.Icon + "'></div>" + 
        "<h1 class='MonsterTitle'><u>" + categoryData.Name + "</u></h1>" +
        "<h2 class='MonsterQuote'><u>\"" + categoryData.Quote + "\"</u></h2>" +
        "<div class='MonsterStatsCategory'>" +
        "<h2 class='StatsTitle'>BASE STATS:</h2>" + 
        "<hr class='StatsDivisor'>";

    for (var baseStat of categoryData.Base_Stats) {
        finalStr += "<p class='StatsDescriptor'";

        if (baseStat.Misc.ToolTip) {
            finalStr += "onmouseenter=\"ShowToolTip('" + baseStat.Misc.ToolTip + "')\"" +
                        "onmouseleave='HideToolTip()'";
        }

        finalStr += ">" + baseStat.Name +
            ": <span class='StatsNumber'>" + baseStat.Value + baseStat.Unit;
        if (baseStat.Misc.Suffix) {
            finalStr += " " + baseStat.Misc.Suffix;
        }

        finalStr += "</span></p>";
    }

    finalStr += "</div>";
    
    finalStr += "<h2 class='PowerStatsHeader'>AUDIO</h2>" +
        "<hr class='StatsDivisor'>" +
        "<div class='StatsCategory'>";
    
    let c = 0;
    for (var track of categoryData.Audio.TENS) {
        finalStr += "<p class='StatsDescriptor'>" +
        track.Name +
        ": " +
        "<audio controls='controls' style='width: 100%;'><source src='" + track.Path + "' type='audio/ogg'></audio></p>";
    }

    finalStr += "</div>";

    finalStr += "<h2 class='PowerStatsHeader'>POWERS</h2>" +
        "<hr class='StatsDivisor'>";


    let i = 0;
    for (var power of categoryData.Powers) {
        finalStr += "<div class='StatsCategory' id='POWERSTATSCATEGORY" + i + "'>" +
            "<img class='PowerImage' src='" + power.Icon + "'>" + 
            "<h2 class='StatsTitle'>" + power.Name + "</h2>" +
            "<hr class='StatsDivisor'>";

        for (var powerStat of power.Stats) {
            finalStr += "<p class='StatsDescriptor' ";
            
            if (baseStat.Misc.ToolTip) {
                finalStr += "onmouseenter=\"ShowToolTip('" + powerStat.Misc.ToolTip + "')\"" +
                            "onmouseleave=\"HideToolTip()\"";
            }

            finalStr += ">" + powerStat.Name +
                ": <span class='StatNumber'>" + powerStat.Value + powerStat.Unit;
            if (powerStat.Misc.Suffix) {
                finalStr += " " + powerStat.Misc.Suffix;
            }

            
            finalStr += "</span></p>";
        }

        let numPowerMutations = 0;
        for (var mutation of categoryData.Mutations) {
            if (mutation.PowerID == i) {
                numPowerMutations++;
            }
        }
        if (numPowerMutations > 0) {
            console.log(categoryData.Mutations)
            finalStr += "<h2 class='PowerStatsHeader'>MUTATIONS</h2>";
            finalStr += "<table><tbody class='MutationTable'><tr class='MutationRow' id='MUTATIONTABLEROW" + i + "'>" +
            "</tr></tbody></table>";
        }

        finalStr += "</div>";

        i++;
    }

    finalStr += "<h2 class='PowerStatsHeader'>PERKS</h2><hr class='StatsDivisor'>";

    finalStr += "<table class='PerkTable'><tbody class='PerkTable'><tr class='PerkRow'>"

    for (var perk of categoryData.Perks) {
        let perkData = perks[perk];

        finalStr += "<td>";

        finalStr += "<img src='" + perkData.Icon + "' class='PerkImage'>";
        finalStr += "<h2 class='PerkTitle'>" + perkData.Name + "</h2><hr class='StatsDivisor'>";
        
        finalStr += "<div class='PerkDescriptionContainer'><span class='PerkDescription'>" + perkData.Description + "</span></div>"

        finalStr += "</td>"
            
    }

    finalStr += "</tr></tbody></table>";
    
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