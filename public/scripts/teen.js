var contentPanel;
var categories = ["data/stats/teen/movement.json", "data/stats/teen/healing.json", "data/stats/teen/comms.json", "data/stats/teen/actions.json"]
var categoryDivs = [] //Dynamically add divs to this array for future tracking.


var tooltipTimeouts = []


function mainTeen() {
    contentPanel = document.getElementById("contentpanel");
    console.log("Found contentpanel! Beginning category loading...");
    for (var i = 0; i < categories.length; i++) {
        console.log("Attempting to load category '" + categories[i] + "'!");
        GetCategoryData(i);
    }
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
    contentPanel.innerHTML += 
    "<div class='StatsCategory'>" +
        "<h1 class='StatsTitle'>" + categoryData.Name + "</h1>" +
        "<hr class='StatsDivisor'>" + 
        "<p>" + categoryData.Description + "</p>" + GetStats(categoryData);
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