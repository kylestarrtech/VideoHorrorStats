var username = ""
var apiKey = "";

var creatorList = "data/creatorhub/creators.json"
var creators = []

var selectedCreator = -1;

function TryLogin() {
    apiKey = document.getElementById("keyInput").value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = JSON.parse(xhttp.responseText);
            console.log(response);
            username = response.Name;

            if (response["ReboundReq"]) {
                var rebound = new XMLHttpRequest();
                rebound.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        document.getElementById("BasePanel").innerHTML = rebound.responseText;
                        UpdateInfo();
                    }
                }
                rebound.open("GET", "/admin/loginRebound", true);
                rebound.setRequestHeader("API-Key", apiKey);
                rebound.send()
            }
        } else if (this.status == 401) {
            document.getElementById("loginResult").hidden = false;
        }
    }
    xhttp.open("POST", "/admin/loginAttempt", true);
    xhttp.setRequestHeader("API-Key", apiKey);
    xhttp.send();
}

function GetCreators() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            creators = JSON.parse(xhttp.responseText)["CREATORS"];
            UpdateCreators();
        }
    }
    xhttp.open("GET", "data/creatorhub/creators.json", true);
    xhttp.send();
}

function UpdateCreators() {
    let creatorContainer = document.getElementById("CreatorList");
    creatorContainer.innerText = "";

    let finalStr = "";

    let i = 0;
    for(var creator of creators) {
        finalStr += "<button " +
        "class=\"CreatorButton\" " +
        "onclick=\"SelectCreator(" + i + ")\">" +
        creator.Name + "</button>";
    }

    creatorContainer.innerHTML = finalStr;
}

function UpdateInfo() {
    console.log("Updating info...");
    document.getElementById("usernameText").innerText = username;
    GetCreators();
}