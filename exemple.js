const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paramètres du grille et du canvas
const gridSize = 20;  // Chaque carré fait 20x20 pixels
const canvasSize = canvas.width / gridSize;  // Nombre de cases sur le canvas

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };  // Initialisation du serpent
let food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };

let obstacles = []; // Pas d'obstacles au début

let gameOver = false;
let gameStarted = false;

let score = 0;
function updateScore() {
    document.getElementById("score").textContent = score;
}

let highscore = 0;
function updatehighScore() {
    if (score > highscore) {
        highscore = score;
        document.getElementById("highScore").textContent = highscore;
    }
}

let speed = 120;
let gameInterval;
function updateSpeed() {
    speed = speed - 5 * score;
    if (speed < 0) speed = 70; // Empêche la vitesse de descendre sous 70ms

    clearInterval(gameInterval); // Annule l'intervalle précédent
    gameInterval = setInterval(gameLoop, speed); // Démarre un nouvel intervalle avec la nouvelle vitesse
}

// Fonction pour dessiner un carré (utilisé pour les obstacles)
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

// Dessiner un cercle pour le serpent et la nourriture
function drawCircle(x, y, color) {
    ctx.beginPath();
    ctx.arc(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// Dessiner le serpent, la nourriture et les obstacles
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les obstacles
    obstacles.forEach(obstacle => drawSquare(obstacle.x, obstacle.y, 'white'));

    // Dessiner chaque segment du serpent sous forme de cercle
    snake.forEach(segment => drawCircle(segment.x, segment.y, '#10B981'));

    // Dessiner la nourriture sous forme de cercle
    drawCircle(food.x, food.y, 'red');
}

// Ajouter un nouvel obstacle
function addObstacle() {
    let newObstacle;
    let isValidPosition = false;

    // Générer un obstacle dans une position valide
    while (!isValidPosition) {
        newObstacle = {
            x: Math.floor(Math.random() * canvasSize),
            y: Math.floor(Math.random() * canvasSize)
        };

        // Vérifier que l'obstacle ne chevauche pas le serpent, la nourriture ou un autre obstacle
        isValidPosition =
            !snake.some(segment => segment.x === newObstacle.x && segment.y === newObstacle.y) &&
            !(food.x === newObstacle.x && food.y === newObstacle.y) &&
            !obstacles.some(obstacle => obstacle.x === newObstacle.x && obstacle.y === newObstacle.y);
    }

    obstacles.push(newObstacle);
}

// Mettre à jour la position du serpent
function updateSnake() {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Si le serpent mange la nourriture
    if (newHead.x === food.x && newHead.y === food.y) {
        food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
        score += 1;
        updateScore();
        updateSpeed();

        // Ajouter un obstacle tous les 5 points
        if (score % 5 === 0) {
            addObstacle();
        }
    } else {
        snake.pop();  // Retirer le dernier segment si pas de nourriture mangée
    }

    snake.unshift(newHead);
}

// Vérifier les collisions
function checkCollision() {
    const head = snake[0];

    // Collision avec le mur
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver = true;
    }

    // Collision avec le corps
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }

    // Collision avec les obstacles
    obstacles.forEach(obstacle => {
        if (head.x === obstacle.x && head.y === obstacle.y) {
            gameOver = true;
        }
    });

    if (gameOver) {
        alert("Fin de partie!");
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
        food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
        obstacles = []; // Réinitialiser les obstacles
        gameOver = false;
        updatehighScore();
        score = 0;
        speed = 120; // Réinitialiser la vitesse
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 120);
        updateScore();
    }
}

// Écouter les touches du clavier
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Boucle principale du jeu
function gameLoop() {
    if (!gameOver) {
        updateSnake();
        checkCollision();
        drawGame();
    }
}

// Démarrer le jeu avec Espace
document.addEventListener('keydown', (event) => {
    if (!gameStarted && event.key === ' ') {
        gameStarted = true;
        gameLoop();
    }
});

// Exécuter la boucle toutes les 100 ms (initialement)
gameInterval = setInterval(gameLoop, 120);
