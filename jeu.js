const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paramètres de la grille et du canvas
const gridSize = 20; 
const canvasSize = canvas.height / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
let gameOver = false;
let gameStarted = false;

// Dessiner un carré
function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

// Dessiner le serpent et la nourriture
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.forEach(segment => drawSquare(segment.x, segment.y, 'lime'));
  drawSquare(food.x, food.y, 'red');
}

// Mettre à jour le serpent
function updateSnake() {
  const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Manger la nourriture
  if (newHead.x === food.x && newHead.y === food.y) {
    food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

// Vérifier les collisions
function checkCollision() {
  const head = snake[0];

  // Collision murale
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    gameOver = true;
  }

  // Collision avec le corps
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
    }
  }

  if (gameOver) {
    alert("Fin de partie!");
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
    gameOver = false;
  }
}

// Écouter les touches
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

// Démarrer le jeu avec Espace
document.addEventListener('keydown', (event) => {
  if (!gameStarted && event.key === ' ') {
    gameStarted = true;
    gameLoop();
  }
});

// Boucle du jeu
function gameLoop() {
  if (!gameOver) {
    updateSnake();
    checkCollision();
    drawGame();
    requestAnimationFrame(gameLoop);
  }
}
