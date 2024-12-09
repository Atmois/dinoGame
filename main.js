// Canvas Specs
const block = 25;
const rows = 5;
const columns = 15;
var board;
var ctx;

// Dino position
var dinoX = block * 1;
var dinoY = (rows - 1) * block;

// Dino velocity
var velocityX = 0.5;
var velocityY = 0;

// Cacti position
var cactiX = 0;
var cactiY = (rows - 1) * block;

// Misc
var score = 0;
var alive = true;

// Scroll position
var scrollX = 0;

window.onload = function () {
    dinoGame = document.getElementById("dinoGame");
    scoreTxt = document.getElementById("scoreTxt");
    toggleViewModeBtn = document.getElementById("toggleDarkMode");

    resizeCanvas();

    ctx = dinoGame.getContext("2d");

    cactiSpawn()

    document.addEventListener("keydown", jumpChar);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("mousedown", handleMouseClick);
    window.addEventListener("resize", resizeCanvas);
    toggleViewModeBtn.addEventListener("click", toggleDarkMode);

    setInterval(redraw, 100);
};

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Scale based on screensize
function resizeCanvas() {
    dinoGame.width = Math.min(window.innerWidth, columns * block);
    dinoGame.height = Math.min(window.innerHeight, rows * block);
}

function redraw() {
    if (!alive) return;

    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, dinoGame.width, dinoGame.height);

    // Make dino go zooom
    if (score == 0) {
        velocityX = 0.5
    } else if (score >= 75) {
        velocityX = 2
    }
    else {
        velocityX = 0.5 + (score / 50)
    }

    // Dino and scroll
    scrollX += velocityX * block;
    dinoY += velocityY * block;

    // Gravity
    if (dinoY < (rows - 1) * block) {
        velocityY += 0.4;
    } else {
        dinoY = (rows - 1) * block;
        velocityY = 0;
    }

    // Draw the cacti
    ctx.fillStyle = "green";
    ctx.fillRect(cactiX - scrollX, cactiY, block, block);

    // Check if cacti leave screen (and count score)
    if (cactiX - scrollX < 0) {
        cactiSpawn();
        score++;
        scoreTxt.innerText = "Score: " + score;
    }

    // Spawn the dino
    ctx.fillStyle = "black";
    ctx.fillRect(dinoX, dinoY, block, block);

    // Death by collision
    if (dinoX < cactiX - scrollX + block && dinoX + block > cactiX - scrollX && dinoY < cactiY + block && dinoY + block > cactiY) {
        alive = false;
        displayGameOver();
        return;
    }
}

// The popup for when the player dies
function displayGameOver() {
    // Game over text
    ctx.fillStyle = "black";
    ctx.font = "50px AtkinsonHyperlegible";
    var text = "Game Over";
    var textWidth = ctx.measureText(text).width;
    var x = (dinoGame.width - textWidth) / 2;
    var y = dinoGame.height / 2;
    ctx.fillText(text, x, y);

    // Reset Button
    if (!document.querySelector(".reset-button")) {
        var resetButton = document.createElement("button");
        resetButton.innerText = "Reset";
        resetButton.className = "button reset-button";
        document.body.appendChild(resetButton);
        resetButton.addEventListener("click", resetGame);
    }
}

function resetGame() {
    // Reset specs
    dinoX = block * 1;
    dinoY = (rows - 1) * block;
    velocityX = 0.5;
    velocityY = 0;
    score = 0;
    scoreTxt.innerText = "Score: " + score;
    alive = true;
    cactiX = (columns - 1) * block;
    scrollX = 0;

    // Hide button
    var resetButton = document.querySelector(".reset-button");
    if (resetButton) {
        resetButton.remove();
    }

    // Restart the game
    redraw();
}

// Dino Jump
function jumpChar(e) {
    switch (e.code) {
        case "Space":
        case "ArrowUp":
            if (dinoY == (rows - 1) * block) {
                velocityY = -1;
            }
            break;
    }
}

// Spawn the cacti
function cactiSpawn() {
    cactiX = dinoGame.width + scrollX + Math.random() * dinoGame.width;
    cactiY = (rows - 1) * block;
}

// Touch on screen for mobile
function handleTouchStart() {
    const mockEvent = { code: "Space" };
    jumpChar(mockEvent);
}

// Click with mouse
function handleMouseClick() {
    const mockEvent = { code: "Space" };
    jumpChar(mockEvent);
}