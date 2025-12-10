// 1. The Word List
const golfWords = [
    "SLICE", "GREEN", "ROUGH", "CADDY", "BOGEY", 
    "EAGLE", "SHANK", "DRIVE", "DIVOT", "WEDGE", 
    "WOODS", "LINKS", "PUTTS", "SCORE", "RANGE",
    "TRAPS", "BIRDS", "PAR72", "PITCH", "CHIPS",
    "IRON", "SWING", "FORE!", "GRIPS", "HOOKS", 
    "TIGER", "FADES", "SLICE",
];

let secretWord = "";
let currentRow = 0;
let currentTile = 0;
const rows = 6;
const cols = 5;
let guesses = [];
let isGameOver = false;

// 2. Setup the Game (Run this on load)
function initGame() {
    // Reset variables
    secretWord = golfWords[Math.floor(Math.random() * golfWords.length)];
    console.log("Secret Word:", secretWord);
    currentRow = 0;
    currentTile = 0;
    isGameOver = false;
    guesses = [
        ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""],
        ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]
    ];

    // Clear board HTML
    const board = document.getElementById("game-board");
    board.innerHTML = ''; 
    
    // Re-create tiles
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            board.appendChild(tile);
        }
    }

    // Reset Keyboard Colors
    document.querySelectorAll(".key-row button").forEach(btn => {
        btn.style.backgroundColor = "#d3d6da";
        if(btn.className !== "wide-button") btn.style.backgroundColor = "#d3d6da";
    });

    // Hide Modal
    document.getElementById("game-over-modal").classList.add("hidden");
}

// Start the game for the first time
initGame();

// 3. Reset Function (Called by the button)
function resetGame() {
    initGame();
}

// 4. Handle Input
document.addEventListener("keyup", (e) => { processInput(e.key); });
const keys = document.querySelectorAll("#keyboard-container button");
keys.forEach(key => {
    key.addEventListener("click", () => {
        const letter = key.getAttribute("data-key");
        processInput(letter);
    });
});

function processInput(key) {
    if (isGameOver) return; // Stop playing if game is over

    if (key === "Enter") {
        if (currentTile > 4) checkGuess();
    } else if (key === "Backspace" || key === "Delete") {
        if (currentTile > 0) {
            currentTile--;
            const tile = document.getElementById(currentRow.toString() + "-" + currentTile.toString());
            tile.innerText = "";
            guesses[currentRow][currentTile] = "";
        }
    } else if (/^[a-zA-Z]$/.test(key)) {
        if (currentTile < 5 && currentRow < 6) {
            const tile = document.getElementById(currentRow.toString() + "-" + currentTile.toString());
            tile.innerText = key.toUpperCase();
            guesses[currentRow][currentTile] = key.toUpperCase();
            currentTile++;
        }
    }
}

// 5. Check Logic & Golf Scoring
function checkGuess() {
    const guess = guesses[currentRow].join("");
    
    // Animation & Coloring
    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById(currentRow.toString() + "-" + i.toString());
        const letter = guesses[currentRow][i];
        const keyButton = document.querySelector(`button[data-key="${letter.toLowerCase()}"]`);
        
        setTimeout(() => {
            if (letter === secretWord[i]) {
                tile.classList.add("correct");
                if (keyButton) keyButton.style.backgroundColor = "#6aaa64";
            } else if (secretWord.includes(letter)) {
                tile.classList.add("present");
                if (keyButton && keyButton.style.backgroundColor !== "rgb(106, 170, 100)") {
                     keyButton.style.backgroundColor = "#c9b458";
                }
            } else {
                tile.classList.add("absent");
                if (keyButton) keyButton.style.backgroundColor = "#787c7e";
            }
        }, 200 * i);
    }

    // Win/Loss Logic with Golf Terms
    setTimeout(() => {
        if (guess === secretWord) {
            isGameOver = true;
            let message = "";
            // Golf Scoring!
            if (currentRow === 0) message = "Hole in One! 🏆";
            else if (currentRow === 1) message = "Eagle! 🦅";
            else if (currentRow === 2) message = "Birdie! 🐦";
            else if (currentRow === 3) message = "Par ⛳";
            else if (currentRow === 4) message = "Bogey 😕";
            else message = "Double Bogey 😬";
            
            showModal(message, "Great job!");
        } else {
            if (currentRow >= 5) {
                isGameOver = true;
                showModal("Game Over 💀", "The word was: " + secretWord);
            }
            currentRow++;
            currentTile = 0;
        }
    }, 1500); // Wait for animation to finish
}

function showModal(title, subtitle) {
    const modal = document.getElementById("game-over-modal");
    document.getElementById("game-result").innerText = title;
    document.getElementById("correct-word").innerText = subtitle;
    modal.classList.remove("hidden");
}