const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paramètres du grille et du canvas
const gridSize = 20;  // Chaque carré fait 20x20 pixels
const canvasSize = canvas.width / gridSize;  // Nombre de cases sur le canvas

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };  // Initialisation du serpent
let food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };

let gameOver = false;

// Dessiner un carré sur le canvas
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

// Mettre à jour la position du serpent
function updateSnake() {
  const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Si le serpent mange la nourriture
  if (newHead.x === food.x && newHead.y === food.y) {
    food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
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

  if (gameOver) {
    alert("Fin de partie!");
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: Math.floor(Math.random() * canvasSize), y: Math.floor(Math.random() * canvasSize) };
    gameOver = false;
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

// Exécuter la boucle toutes les 100 ms
setInterval(gameLoop, 100);