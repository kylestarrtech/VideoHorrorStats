var contentPanel;
var categories = ["data/stats/monster/werewolf.json", "data/stats/monster/wart.json", "data/stats/monster/dollmaster.json"]

var selectedCategoryIndex = 0;

var tooltipTimeouts = []

function mainMonster() {
    contentPanel = document.getElementById("contentpanel");
    console.log("Found contentpanel! Beginning category loading...");
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

function LoadCategory(categoryData) {
    contentPanel.innerHTML = "<div class='StatsCategory'>" + GenerateStatsPage(categoryData);
}

function UpdateSelectedCategory(index) {
    selectedCategoryIndex = index;
    GetCategoryData(selectedCategoryIndex);
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
        finalStr += "<p class='StatsDescriptor' ";

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
    
    finalStr += "<h2 class='PowerStatsHeader'>POWERS</h2>" +
        "<hr class='StatsDivisor'>";

    for (var power of categoryData.Powers) {
        finalStr += "<div class='StatsCategory'>" +
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
        
        finalStr += "</div>";
    }
    
    return finalStr;
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