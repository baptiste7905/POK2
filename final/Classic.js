const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const gridSize = 20;  
const canvasSize = canvas.width / gridSize; 
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };  
let food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
let obstacles = [];
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
    speed = speed - 0.1 * score;
    if (speed < 50) speed = 50;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

function drawCircle(x, y, color) {
    ctx.beginPath();
    ctx.arc(x * gridSize + gridSize / 2, y * gridSize + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    obstacles.forEach(obstacle => drawSquare(obstacle.x, obstacle.y, 'white'));
    snake.forEach(segment => drawCircle(segment.x, segment.y, '#10B981'));
    drawCircle(food.x, food.y, 'red');
}

function addObstacle() {
    let newObstacle;
    let isValidPosition = false;

    while (!isValidPosition) {
        newObstacle = {
            x: Math.floor(Math.random() * canvasSize),
            y: Math.floor(Math.random() * canvasSize)
        };
        isValidPosition =
            !snake.some(segment => segment.x === newObstacle.x && segment.y === newObstacle.y) &&
            !(food.x === newObstacle.x && food.y === newObstacle.y) &&
            !obstacles.some(obstacle => obstacle.x === newObstacle.x && obstacle.y === newObstacle.y);
    }

    obstacles.push(newObstacle);
}

function isPositionValid(x, y) {
    return !snake.some(segment => segment.x === x && segment.y === y) &&
           !obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);
}

function generateFood() {
    let newFood;
    let isValid = false;

    while (!isValid) {
        newFood = {
            x: Math.floor(Math.random() * canvasSize),
            y: Math.floor(Math.random() * canvasSize)
        };
        isValid = isPositionValid(newFood.x, newFood.y);
    }

    return newFood;
}

function updateSnake() {
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (newHead.x === food.x && newHead.y === food.y) {
        food = generateFood();
        score += 1;
        updateScore();
        updateSpeed();

        if (score % 5 === 0) {
            addObstacle();
        }
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        gameOver = true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
        }
    }

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
        obstacles = [];
        gameOver = false;
        updatehighScore();
        score = 0;
        speed = 120;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 120);
        updateScore();
    }
}

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

function gameLoop() {
    if (!gameOver) {
        updateSnake();
        checkCollision();
        drawGame();
    }
}

document.addEventListener('keydown', (event) => {
    if (!gameStarted && event.key === ' ') {
        gameStarted = true;
        gameLoop();
    }
});

gameInterval = setInterval(gameLoop, 120);
