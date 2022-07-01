function HighlightButton(type) {
    document.getElementById(type + "RoleButton").src = 'public/images/header/' + type + '/highlighted.png';
}

function UnhighlightButton(type) {
    document.getElementById(type + "RoleButton").src = 'public/images/header/' + type + '/base.png';
}