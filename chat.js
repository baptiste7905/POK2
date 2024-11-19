const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-btn');
const scoreDisplay = document.getElementById('score');

const gridSize = 20; // Taille de la grille
const cellSize = gameBoard.offsetWidth / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };

let gameInterval;
let score = 0;

// Créer un élément HTML pour un segment du serpent ou la nourriture
function createElement(x, y, className) {
  const element = document.createElement('div');
  element.style.gridRowStart = y + 1;
  element.style.gridColumnStart = x + 1;
  element.classList.add(className);
  return element;
}

// Afficher le serpent et la nourriture
function drawGame() {
  gameBoard.innerHTML = ''; // Efface le plateau
  snake.forEach(segment => gameBoard.appendChild(createElement(segment.x, segment.y, 'snake')));
  gameBoard.appendChild(createElement(food.x, food.y, 'food'));
}

// Mettre à jour la position du serpent
function updateSnake() {
  const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Si le serpent mange la nourriture
  if (newHead.x === food.x && newHead.y === food.y) {
    food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
    score++;
    scoreDisplay.textContent = score;
  } else {
    snake.pop(); // Retirer le dernier segment si pas de nourriture mangée
  }

  snake.unshift(newHead);
}

// Vérifier les collisions
function checkCollision() {
  const head = snake[0];

  // Collision avec les murs
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
    endGame();
  }

  // Collision avec le corps
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
    }
  }
}

// Terminer la partie
function endGame() {
  clearInterval(gameInterval);
  alert(`Game Over! Score final: ${score}`);
  resetGame();
}

// Réinitialiser le jeu
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = { x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) };
  score = 0;
  scoreDisplay.textContent = score;
  drawGame();
}

// Commencer le jeu
function startGame() {
  resetGame();
  gameInterval = setInterval(() => {
    updateSnake();
    checkCollision();
    drawGame();
  }, 150);
}

// Contrôles
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

// Lancer le jeu au clic sur "Start"
startButton.addEventListener('click', startGame);
