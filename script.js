const startPage = document.getElementById('startPage');
const startButton = document.getElementById('startButton');
const gamePage = document.getElementById('gamePage');
const gameOverBoard = document.getElementById('gameOverBoard');
const restartButton = document.getElementById('restartButton');
const foodSound = new Audio('Score.mp3');
const hitSound = new Audio('Hit.mp3');
const gameOverSound = new Audio('Level Completion.mp3');
const playBoard = document.querySelector("#board");
const scoreElement = document.querySelector("#scoreBox");
const highScoreElement = document.querySelector("#highscoreBox");

let startingX, startingY, movingX, movingY;
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

startButton.addEventListener('click', startGame);

function startGame() {
  startPage.style.display = 'none';
  gamePage.style.display = 'block';

  resetGame();
  updateFoodPosition();
  setIntervalId = setInterval(initGame, 350);
}

function resetGame() {
  gameOver = false;
  snakeX = 5;
  snakeY = 5;
  velocityX = 0;
  velocityY = 0;
  snakeBody = [];
  score = 0;
  scoreElement.innerText = `Score: ${score}`;
}

const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 18) + 1;
  foodY = Math.floor(Math.random() * 18) + 1;
}
restartButton.addEventListener('click', function() {
  startGame();
  gameOverBoard.style.display = "none"; // Hide the game over board
});

function handleGameOver() {
  clearInterval(setIntervalId);
  gameOverSound.play();
  gameOver = true;
  gameOverBoard.style.display = "block";
  resetGame();
}


const changeDirection = e => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }

};
function handleSwipeGesture(direction) {
  switch (direction) {
    case "up":
      if (velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
      }
      break;
    case "down":
      if (velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
      }
      break;
    case "left":
      if (velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
      }
      break;
    case "right":
      if (velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
      }
      break;
  }
}

function handleTouchStart(event) {
  const touch = event.touches[0];
  touchStartPos.x = touch.clientX;
  touchStartPos.y = touch.clientY;
}

function handleTouchMove(event) {
  const touch = event.touches[0];
  touchMovePos.x = touch.clientX;
  touchMovePos.y = touch.clientY;
}


function handleTouchEnd() {
  const diffX = touchMovePos.x - touchStartPos.x;
  const diffY = touchMovePos.y - touchStartPos.y;
  const absDiffX = Math.abs(diffX);
  const absDiffY = Math.abs(diffY);

  if (absDiffX > absDiffY && absDiffX > 100) {
    if (diffX > 0) {
      handleSwipeGesture("right");
    } else {
      handleSwipeGesture("left");
    }
  } else if (absDiffY > absDiffX && absDiffY > 100) {
    if (diffY > 0) {
      handleSwipeGesture("down");
    } else {
      handleSwipeGesture("up");
    }
  }
}

const initGame = () => {
  if (gameOver) return handleGameOver();
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    foodSound.play();
    updateFoodPosition();
    snakeBody.push([foodY, foodX]);
    score++;
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }

  snakeX += velocityX;
  snakeY += velocityY;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  snakeBody[0] = [snakeX, snakeY];

  if (snakeX <= 0 || snakeX > 18 || snakeY <= 0 || snakeY > 18) {
    hitSound.play();
    return gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    const isHead = i === 0;
    const isTail = i === snakeBody.length - 1;
    const snake = isHead ? "head" : isTail ? "tail" : "snake";
    html += `<div class="${snake}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

    if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
      hitSound.play();
      gameOverSound.play();
      gameOver = true;
    }
  }
  playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 350);
document.addEventListener("keyup", changeDirection);
document.addEventListener("touchstart", handleTouchStart);
document.addEventListener("touchmove", handleTouchMove);
document.addEventListener("touchend", handleTouchEnd);
