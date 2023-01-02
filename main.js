const chooseModes = document.querySelectorAll(".choose__mode");
const chooseSpeeds = document.querySelectorAll(".choose__speed");
const btnStart = document.getElementById("btnStart");
const startGame = document.getElementById("startGame");
const btnReset = document.getElementById("button__reset");
const continueGame = document.getElementById("continueGame");
const btnContinueGame = document.getElementById("btnContinueGame");
const btnPause = document.getElementById("button__pause");
const lostGame = document.getElementById("lostGame");
const lostGameScore = document.getElementById("lostGame__score");
const btnPlayAgain = document.getElementById("btnPlayAgain");
const gameBoard = document.querySelector("#gameBoard");
const context = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const rankingGame = document.getElementById("rankingGame");
const btnVolume = document.getElementById("volume");
const buttonMoves = document.querySelectorAll(".button__move");

const unitSize = 20;
const tools = document.getElementById("tools");
const valueWidth = Math.floor((screen.width * 0.8) / unitSize) * unitSize;
const valueHeight = Math.floor((screen.height * 0.6) / unitSize) * unitSize;

tools.style.width = `${valueWidth}px`;
gameBoard.width = `${valueWidth}`;
gameBoard.height = `${valueHeight}`;

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "pink";
const snakeColor = "#92400e";
const snakeBorder = "black";
const foodColor = "red";

var running = false;
var xVelocity = unitSize;
var yVelocity = 0;
var foodX;
var foodY;
var score = 0;
var snake = [
  { x: unitSize * 5, y: 0 },
  { x: unitSize * 4, y: 0 },
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];
var speed;
var chooseDirection;

var audio = new Audio("assets/music.mp3");
// On Off Volumn
btnVolume.onclick = function () {
  if (btnVolume.textContent.includes("volume_off")) {
    audio.loop = true;
    audio.play();
    btnVolume.textContent = "volume_up";
  } else {
    audio.pause();
    btnVolume.textContent = "volume_off";
  }
};

buttonMoves.forEach((buttonMove, index) => {
  buttonMove.onclick = function (e) {
    chooseDirection = index;
  };
});

// change mode
chooseModes.forEach((chooseMode, index) => {
  chooseMode.onclick = function (e) {
    document.querySelector(".choose__mode.active").classList.remove("active");
    chooseMode.classList.add("active");
  };
});

// change speed
chooseSpeeds.forEach((chooseSpeed, index) => {
  chooseSpeed.onclick = function (e) {
    document.querySelector(".choose__speed.active").classList.remove("active");
    chooseSpeed.classList.add("active");
  };
});

// On off container startGame
btnStart.onclick = function () {
  startGame.classList.remove("active");
  resetGame();
};

btnReset.onclick = function () {
  startGame.classList.add("active");
};

// On off container continueGame
btnContinueGame.onclick = function () {
  continueGame.classList.remove("active");
};

btnPause.onclick = function () {
  continueGame.classList.add("active");
};

window.addEventListener("keydown", changeDirectionWithKeyCode);
window.addEventListener("click", changeDirectionWithButton);

function gameStart() {
  running = true;
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick();
}

function nextTick() {
  chooseSpeeds.forEach((chooseSpeed, index) => {
    if (chooseSpeed.classList.value.includes("active")) {
      if (index === 0) {
        speed = 300;
      }
      if (index === 1) {
        speed = 150;
      }
      if (index === 2) {
        speed = 50;
      }
    }
  });

  if (running) {
    setTimeout(() => {
      clearGame();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, speed);
  } else {
    if (!startGame.classList.value.includes("active")) {
      displayGameOver();
    }
  }
}
function clearGame() {
  context.fillStyle = boardBackground;
  context.fillRect(0, 0, gameWidth, gameHeight);
}
function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
}
function drawFood() {
  context.fillStyle = foodColor;
  context.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
  if (!continueGame.classList.value.includes("active")) {
    let checkMode;
    chooseModes.forEach((chooseMode, index) => {
      if (chooseMode.classList.value.includes("active")) {
        checkMode = index;
      }
    });

    let head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
    if (checkMode === 1) {
      switch (true) {
        case snake[0].x >= gameWidth:
          xVelocity = unitSize;
          yVelocity = 0;
          head = { x: 0 + xVelocity - unitSize, y: snake[0].y + yVelocity };
          break;
        case snake[0].x < 0:
          xVelocity = -unitSize;
          head = { x: gameWidth + xVelocity, y: snake[0].y + yVelocity };
          break;
        case snake[0].y > gameHeight:
          xVelocity = 0;
          yVelocity = unitSize;
          head = { x: snake[0].x + xVelocity, y: 0 + yVelocity - unitSize };
          break;
        case snake[0].y < 0:
          xVelocity = 0;
          yVelocity = -unitSize;
          head = { x: snake[0].x + xVelocity, y: gameHeight + yVelocity };
          break;
      }
    }
    snake.unshift(head);

    if (snake[0].x == foodX && snake[0].y == foodY) {
      score += 1;
      scoreText.textContent = score;
      createFood();
    } else {
      snake.pop();
    }
  }
}

function drawSnake() {
  context.fillStyle = snakeColor;
  snake.forEach((snakePart) => {
    context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}

function changeDirectionWithKeyCode(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  // check if snake direction top and press dow not game over
  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingRight = xVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;
  switch (true) {
    case keyPressed == LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyPressed == RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyPressed == DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

// changeDirectionWithButton(
function changeDirectionWithButton(event) {
  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingRight = xVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;

  switch (true) {
    case chooseDirection == 1 && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case chooseDirection == 0 && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case chooseDirection == 3 && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case chooseDirection == 2 && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

function checkGameOver() {
  let checkMode;
  chooseModes.forEach((chooseMode, index) => {
    if (chooseMode.classList.value.includes("active")) {
      checkMode = index;
    }
  });
  if (checkMode === 0) {
    switch (true) {
      case startGame.classList.value.includes("active"):
        lostGame.classList.remove("active");
        running = false;
        break;
      case snake[0].x < 0:
        running = false;
        break;
      case snake[0].x >= gameWidth:
        running = false;
        break;
      case snake[0].y < 0:
        running = false;
        break;
      case snake[0].y >= gameHeight:
        running = false;
        break;
    }
  }

  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}

function displayGameOver() {
  lostGame.classList.add("active");
  lostGameScore.textContent = scoreText.textContent;
  btnPlayAgain.onclick = function () {
    lostGame.classList.remove("active");
    resetGame();
  };
}

function resetGame() {
  gameStart();
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;

  snake = [
    { x: unitSize * 5, y: 0 },
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  chooseDirection = undefined;
}
