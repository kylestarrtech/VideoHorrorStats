function mainIndex() {
    console.log("Home loaded!");
    GetAnnouncements();
}

function GetAnnouncements() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            LoadAnnouncements(JSON.parse(xhttp.responseText).Announcements);
        }
    }
    xhttp.open("GET", "public/announcements/announcements.json", false);
    xhttp.send();
}

function LoadAnnouncements(announcements) {
    var announceContainer = document.getElementById("AnncCntr");

    console.log(announceContainer);
    console.log(announcements);

    let finalStr = "";
    
    for (var announcement of announcements) {
        console.log(announcement);

        finalStr += "<div class='Announcement'><h2 class='AnnouncementTitle'>" +
        announcement.Title + "</h2><h3 class='AnnouncementDate'>" +
        announcement.Date + "</h3><div class='AnnouncementDescription'>" +
        announcement.Description + "</div></div>"

        console.log(finalStr);
    }

    announceContainer.innerHTML = finalStr;
}