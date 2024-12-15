const gameModePopup = document.getElementById("gameModePopup");
const modeButtons = document.querySelectorAll(".popup-button");

// Affiche la pop-up
function showGameModePopup() {
    gameModePopup.classList.add("show");
}

// Cache la pop-up
function hideGameModePopup() {
    gameModePopup.classList.remove("show");
}

// Charge dynamiquement le script en fonction du mode sélectionné
function loadModeScript(mode) {
    const script = document.createElement("script");
    script.src = `${mode}.js`; 
    document.body.appendChild(script);
}

// Gère la sélection du mode
modeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedMode = button.getAttribute("data-mode");
        alert(`Mode ${selectedMode} sélectionné !`);
        hideGameModePopup();
        loadModeScript(selectedMode);
        updateMode(selectedMode); // Appel de la fonction avec le mode sélectionné
    });
});

// Met à jour le mode affiché dans la box
function updateMode(mode) {
    document.getElementById("mode").textContent = mode; // Met à jour l'élément #mode avec le mode choisi
}

// Affiche la pop-up au chargement de la page
showGameModePopup();
