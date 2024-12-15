const gameModePopup = document.getElementById("gameModePopup");
const modeButtons = document.querySelectorAll(".popup-button");

function showGameModePopup() {
    gameModePopup.classList.add("show");
}

function hideGameModePopup() {
    gameModePopup.classList.remove("show");
}

function loadModeScript(mode) {
    const script = document.createElement("script");
    script.src = `${mode}.js`; 
    document.body.appendChild(script);
}

modeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedMode = button.getAttribute("data-mode");
        // alert(`Mode ${selectedMode} sélectionné !`);
        hideGameModePopup();
        loadModeScript(selectedMode);
        updateMode(selectedMode); 
    });
});

function updateMode(mode) {
    document.getElementById("mode").textContent = mode; 
}

showGameModePopup();
