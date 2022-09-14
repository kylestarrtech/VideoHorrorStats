var journeyPaths = ["data/stats/monster/journey/werewolf.json", "data/stats/monster/journey/wart.json", "data/stats/monster/journey/dollmaster.json", "data/stats/monster/journey/deathwire.json", "data/stats/teen/journey/gloria.json", "data/stats/teen/journey/brett.json", "data/stats/teen/journey/jess.json", "data/stats/teen/journey/leo.json", "data/stats/teen/journey/faith.json", "data/stats/teen/journey/reggie.json"]
var selectedJourney = 0;
var selectedAct = 1;

var perkDatabase = null
var perkDatabasePath = "data/stats/perks_and_mutations.json"

var nodeTypeRef = null
var nodeTypeRefPath = "data/stats/journey/nodetypes.json"

function mainJourney() {
    document.getElementById("actSelect").value = "1";

    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('journeyID')) {
        let proposedIndex = parseInt(urlParams.get('journeyID'));
        if (proposedIndex < 0 || proposedIndex >= journeyPaths.length) {
            proposedIndex = 0;
        }
        selectedJourney = proposedIndex;
    }

    if (urlParams.has('actID')) {
        let proposedIndex = parseInt(urlParams.get('actID'));
        if (proposedIndex < 1 || proposedIndex > 3) {
            proposedIndex = 1;
        }
        selectedAct = proposedIndex;
        document.getElementById("actSelect").value = selectedAct;
    }

    GetPerkData();
    GetNodeTypeReferences();
    GetJourneyData(selectedJourney);
}

function UpdateParameters() {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?journeyID=' + selectedJourney + '&actID=' + selectedAct;
    window.history.pushState({path:newurl},'',newurl);
}

function GetPerkData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            perkDatabase = JSON.parse(xhttp.responseText);
        }
    }
    xhttp.open("GET", perkDatabasePath, false);
    xhttp.send();
}

function GetNodeTypeReferences() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            nodeTypeRef = JSON.parse(xhttp.responseText);
        }
    }
    xhttp.open("GET", nodeTypeRefPath, false);
    xhttp.send();
}

function GetJourneyData(index) {
    journeyData = null

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            ParseJourney(JSON.parse(xhttp.responseText));
        }
    }
    xhttp.open("GET", journeyPaths[index], false);
    xhttp.send();
}

function ParseJourney(journeyData) {
    let journeyPanel = document.getElementById("layoutpanel");
    journeyPanel.innerHTML = "<div id='sizeEnforcer'>e</div>";

    let actData = journeyData["1"][selectedAct];

    let headerText = document.getElementById("SelectedCharacter");
    headerText.innerText = journeyData["Name"];

    let id = 0; // This will be used for creating unique IDs for each journey page to facilitate tooltip functionality.

    for (var node in actData) {
        let nodeData = actData[node];

        let nodeType = nodeData["NodeType"];

        if (nodeType === "") { continue; }

        let position = [(nodeData["x"]*100)+15, (nodeData["y"]*100)+33];

        let addedStr = "<div id='NODE_DIV_" + id + "' class='node " + nodeType + "' style='left:" + position[0] + "px; top:" + position[1] + "px;'>";
        
        addedStr += "<img src='public/images/journey/" + nodeType + ".png' width='50px' height='50px' class='journeyimage' onmouseenter=\"ShowJourneyToolTip('Tooltip_" + id + "')\" onmouseleave=\"HideJourneyToolTip('Tooltip_" + id + "')\">";

        if (nodeType != "Blank") {
            addedStr += "<div id='Tooltip_" + id + "' class='nodetooltip' hidden=''";
    
            addedStr += ">";
    
            let nodeTooltipData = UpdateNodeData(nodeData);
    
            if (nodeTooltipData != null) {
    
                let nodeTypeRefData = nodeTypeRef[nodeType];
    
                if (nodeTooltipData["RelyOnAddedData"] == true) {
                    let perkProtoname = nodeData["Rewards"];
    
                    if (perkDatabase[perkProtoname] == undefined) {
                        console.error(perkProtoname + " is not in the database!");
                        perkDatabase[perkProtoname] = {
                            Name: "NOT IN DATABASE",
                            ProtoName: "NULL",
                            Icon: "public/images/perks/lightningfast.png",
                            Description: "This perk/mutation is not in the database! Please notify the developer of Video Horror Stats (@SHADERSOP)!"
                        }
                    }
    
                    addedStr += "<div class='NodeName'>" + perkDatabase[perkProtoname]["Name"];
                    addedStr += "<div class='NodeType'>" + nodeTypeRefData["Type"] + "</div></div>";
                } else {
                    addedStr += "<div class='NodeName'>" + nodeTypeRefData["Type"] + "</div>"
                }
    
                addedStr += "<hr>";
    
                if (nodeTooltipData["RelyOnAddedData"] == true) {
                    let perkData = perkDatabase[nodeData["Rewards"]];
    
                    addedStr += "<div class='NodeDescription'>" + perkData["Description"] + "</div>";
                } else {
                    addedStr += "<div class='NodeDescription'>" + nodeTypeRefData["Description"] + "</div>";
                }
            }
            addedStr += "</div>"
        }

        addedStr += "<div class='connectors'>";

        let travelData = nodeData["CanTravel"];

        if (travelData["N"] == true) {
            addedStr += "<img class='connectorImg' src='public/images/journey/Connector.png' style='height:100px; width:5px; top:-77px; left: 23px;'>"
        }
        if (travelData["E"] == true) {
            addedStr += "<img class='connectorImg' src='public/images/journey/Connector.png' style='height:5px; width:100px; top:23px; left: 28px;'>"
        }
        if (travelData["S"] == true) {
            addedStr += "<img class='connectorImg' src='public/images/journey/Connector.png' style='height:100px; width:5px; top:25px; left: 23px;'>"
        }
        if (travelData["W"] == true) {
            addedStr += "<img class='connectorImg' src='public/images/journey/Connector.png' style='height:5px; width:100px; top:23px; left: -77px;'>"
        }

        addedStr += "</div>"

        journeyPanel.innerHTML += addedStr;

        id++;
    }
}

function UpdateNodeData(nodeData) {
    let nodeType = nodeData["NodeType"];

    let refData = nodeTypeRef;

    if (refData[nodeType] == false) { return null; }
    
    let nodeTypeData = refData[nodeType];
    return nodeTypeData;
}

function UpdateAct() {
    let value = document.getElementById("actSelect").value;
    selectedAct = value;
    GetJourneyData(selectedJourney);
    UpdateParameters();
}

function UpdateSelectedJourney(newJourneyIndex) {
    selectedJourney = newJourneyIndex;
    GetJourneyData(selectedJourney);
    UpdateParameters();
}

function ShowJourneyToolTip(tooltip_id) {
    document.getElementById(tooltip_id).hidden = false;
}

function HideJourneyToolTip(tooltip_id) {
    document.getElementById(tooltip_id).hidden = true;
}