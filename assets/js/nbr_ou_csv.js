//UN AU HAZARD
function handleSubmit() {
    const numberInput = document.getElementById("numberInput").value;
    const fileInput = document.getElementById("fileInput").files[0];
    const errorMsg = document.getElementById("errorMsg");

    errorMsg.textContent = "";

    if (!numberInput && !fileInput) {
        errorMsg.textContent = "Veuillez entrer un nombre ou importer un fichier.";
        return;
    }

    // Cas nombre
    if (numberInput) {
        const list = generateListFromNumber(parseInt(numberInput));
        processList(list);
        return;
    }

    // Cas fichier
    if (fileInput) {
        const fileName = fileInput.name.toLowerCase();

        if (fileName.endsWith(".csv")) {
            readCSV(fileInput);
        } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
            readXLSX(fileInput);
        } else {
            errorMsg.textContent = "Format non supporté (CSV ou XLSX uniquement).";
        }
    }
}


// Lecture CSV
function readCSV(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        const list = parseCSV(text);
        processList(list);
    };

    reader.readAsText(file);
}

// Lecture XLSX
function readXLSX(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Prendre la première feuille
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convertir en tableau
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Transformer en liste simple (1 colonne)
        const list = json
            .flat()
            .map(item => String(item).trim())
            .filter(item => item !== "");

        processList(list);
    };

    reader.readAsArrayBuffer(file);
}

// Générer liste depuis nombre
function generateListFromNumber(n) {
    return Array.from({ length: n }, (_, i) => "Personne " + (i + 1));
}

// Parser CSV
function parseCSV(text) {
    return text
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "");
}

// Traitement final
function processList(list) {
    console.log("Liste :", list);

    if (list.length === 0) {
        alert("Liste vide ou invalide!");
        return;
    }

    const random = list[Math.floor(Math.random() * list.length)];
    alert("Tirage aléatoire : " + random);
}

// FORMER X GROUPES

let shuffledList = [];
let currentIndex = 0;

// Mélanger la liste (algorithme Fisher-Yates)
function shuffle(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Initialiser le tirage
function initRandom(list) {
    shuffledList = shuffle(list);
    currentIndex = 0;
}

// Tirer un élément sans répétition
function getNextRandom() {
    if (shuffledList.length === 0) {
        alert("Liste vide !");
        return null;
    }

    // Si on a fini la liste → on remélange
    if (currentIndex >= shuffledList.length) {
        shuffledList = shuffle(shuffledList);
        currentIndex = 0;
        alert("Nouvelle série de tirage !");
    }

    const result = shuffledList[currentIndex];
    currentIndex++;

    return result;
}

// Créer des groupes de X personnes
function generateGroupsBySize(list, groupSize) {
    const shuffled = shuffle(list);
    const groups = [];

    for (let i = 0; i < shuffled.length; i += groupSize) {
        groups.push(shuffled.slice(i, i + groupSize));
    }

    return groups;
}


function handleGroups() {
    const numberInput = document.getElementById("numberInputGroups").value;
    const fileInput = document.getElementById("fileInputGroups").files[0];
    const groupSize = document.getElementById("groupSize").value;
    const errorMsg = document.getElementById("errorMsgGroup");

    errorMsg.textContent = "";

    if (!groupSize || groupSize <= 0) {
        errorMsg.textContent = "Veuillez entrer la taille des groupes.";
        return;
    }
    if (!numberInput && !fileInput) {
        errorMsg.textContent = "Veuillez entrer un nombre ou importer un fichier.";
        return;
    }
    // CAS NOMBRE
    if (numberInput) {
        const list = generateListFromNumber(parseInt(numberInput));
        processGroups(list, parseInt(groupSize));
        return;
    }

    // CAS FICHIER
    if (fileInput) {
        const fileName = fileInput.name.toLowerCase();

        if (fileName.endsWith(".csv")) {
            readCSVAndGroup(fileInput, groupSize);
        } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
            readXLSXAndGroup(fileInput, groupSize);
        } else {
            errorMsg.textContent = "Format non supporté.";
        }
    }
    
}

//Lecture fichier + groupes

function readCSVAndGroup(file, groupSize) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const list = parseCSV(e.target.result);
        processGroups(list, parseInt(groupSize));
    };

    reader.readAsText(file);
}

function readXLSXAndGroup(file, groupSize) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const list = json.flat().filter(x => x).map(x => x.toString().trim());

        processGroups(list, parseInt(groupSize));
    };

    reader.readAsArrayBuffer(file);
}


//Traitement des groupes

function processGroups(list, groupSize) {
    if (list.length === 0) {
        alert("Liste vide !");
        return;
    }

    const groups = generateGroupsBySize(list, groupSize);

    displayGroups(groups);
}


//Fonction d’affichage

function displayGroups(groups) {
    const container = document.getElementById("result");
    container.innerHTML = "";

    groups.forEach((group, index) => {
        const div = document.createElement("div");
        div.className = "card mb-3 p-3";

        div.innerHTML = `
            <h5>Groupe ${index + 1} (${group.length} personnes)</h5>
            <ul>
                ${group.map(person => `<li>${person}</li>`).join("")}
            </ul>
        `;

        container.appendChild(div);
    });
}
