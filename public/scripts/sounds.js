var monsters = ["WOLFAudio", "TOADAudio", "DLMRAudio", "ERADAudio"]
var monsterType = ["BODYAudio", "DOLLAudio"]

console.log("Sounds Loaded!");

function main() {
    console.log("Start");
    SelectMonsterType(3);
}

function SelectID(index) {
    for (var i = 0; i < monsters.length; i++) {
        if (i == index) { document.getElementById(monsters[i]).hidden = false; continue; }

        document.getElementById(monsters[i]).hidden = true;
    }
}

function SelectMonsterType(index) {
    for (var i = 0; i < monsters.length; i++) {
        if (i == index) { document.getElementById(monsterType[i]).hidden = false; continue; }

        document.getElementById(monsterType[i]).hidden = true;
    }

}