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

const sizeSnakes = 20;
const tools = document.getElementById("tools");
// const valueWidth = Math.floor((screen.width * 0.8) / sizeSnakes) * sizeSnakes;
// const valueHeight = Math.floor((screen.height * 0.6) / sizeSnakes) * sizeSnakes;

let screenWidth = document.body.clientWidth;
let screenHeight = screen.height;
let valueWidth = Math.floor((screenWidth * 0.8) / sizeSnakes) * sizeSnakes;
let valueHeight = Math.floor((screenHeight * 0.6) / sizeSnakes) * sizeSnakes;
tools.style.width = `${valueWidth}px`;
gameBoard.width = `${valueWidth}`;
gameBoard.height = `${valueHeight}`;

window.addEventListener("resize", (event) => {
  screenWidth = event.currentTarget.innerWidth;
  screenWidth = event.currentTarget.innerHeight;
  valueWidth = Math.floor((screenWidth * 0.8) / sizeSnakes) * sizeSnakes;
  valueHeight = Math.floor((screenHeight * 0.6) / sizeSnakes) * sizeSnakes;
  tools.style.width = `${valueWidth}px`;
  gameBoard.width = `${valueWidth}`;
  gameBoard.height = `${valueHeight}`;
});

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "pink";
const snakeColor = "#92400e";
const snakeBorder = "black";
const foodColor = "red";

var running = false;
var xVelocity = sizeSnakes;
var yVelocity = 0;
var foodX;
var foodY;
var score = 0;
var snake = [
  { x: sizeSnakes * 5, y: 0 },
  { x: sizeSnakes * 4, y: 0 },
  { x: sizeSnakes * 3, y: 0 },
  { x: sizeSnakes * 2, y: 0 },
  { x: sizeSnakes, y: 0 },
  { x: 0, y: 0 },
];
var speed;
var chooseDirection;

var audio = new Audio("assets/music.mp3");
var check;

const countNumber = document.getElementById("countNumber");
function changeCountNumber() {
  let number = 2;
  countNumber.textContent = 3;
  setInterval(() => {
    if (number > 0) {
      countNumber.textContent = number;
      number = number - 1;
      countNumber.classList.add("active");
    }
  }, 1000);
  setTimeout(() => {
    countNumber.classList.remove("active");
  }, 3000);
}

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
  running = false;
  startGame.classList.add("active");
};

// On off container continueGame
btnContinueGame.onclick = function () {
  continueGame.classList.remove("active");
  countNumber.classList.add("active");
  changeCountNumber();
};

btnPause.onclick = function () {
  continueGame.classList.add("active");
};

window.addEventListener("keydown", changeDirectionWithKeyCode);
window.addEventListener("click", changeDirectionWithButton);

function gameStart() {
  running = true;
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

  // if (running) {
  //   setTimeout(() => {
  //     clearGame();
  //     drawFood();
  //     moveSnake();
  //     drawSnake();
  //     checkGameOver();
  //     nextTick();
  //   }, speed);
  // } else {
  //   if (!startGame.classList.value.includes("active")) {
  //     displayGameOver();
  //   }
  // }

  function timeoutHandler() {
    clearGame();
    drawFood();
    moveSnake();
    drawSnake();
    checkGameOver();
    nextTick();
  }

  function changeToRAF() {
    window.requestAnimationFrame(timeoutHandler);
  }

  if (running) {
    setTimeout(changeToRAF, speed);
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
      Math.round((Math.random() * (max - min) + min) / sizeSnakes) * sizeSnakes;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - sizeSnakes);
  foodY = randomFood(0, gameHeight - sizeSnakes);
}
function drawFood() {
  context.fillStyle = foodColor;
  context.fillRect(foodX, foodY, sizeSnakes, sizeSnakes);
}

function moveSnake() {
  check = false;
  if (
    !continueGame.classList.value.includes("active") &&
    !countNumber.classList.value.includes("active")
  ) {
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
          xVelocity = sizeSnakes;
          yVelocity = 0;
          head = { x: xVelocity - sizeSnakes, y: snake[0].y + yVelocity };
          break;
        //true
        case snake[0].x < 0:
          xVelocity = -sizeSnakes;
          head = { x: gameWidth + xVelocity, y: snake[0].y + yVelocity };
          break;
        case snake[0].y >= gameHeight:
          yVelocity = sizeSnakes;
          head = { x: snake[0].x + xVelocity, y: yVelocity - sizeSnakes };
          break;
        case snake[0].y < 0:
          xVelocity = 0;
          yVelocity = -sizeSnakes;
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
    context.fillRect(snakePart.x, snakePart.y, sizeSnakes, sizeSnakes);
  });
}

function changeDirectionWithKeyCode(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  // check if snake direction top and press down not game over
  const goingUp = yVelocity == -sizeSnakes;
  const goingDown = yVelocity == sizeSnakes;
  const goingRight = xVelocity == sizeSnakes;
  const goingLeft = xVelocity == -sizeSnakes;

  switch (true) {
    case keyPressed == LEFT && !goingRight:
      if (
        snake[0].x == 0 ||
        snake[0].x < 0 ||
        snake[0].x >= gameWidth ||
        snake[0].y == 0 ||
        snake[0].y < 0 ||
        snake[0].y >= gameHeight
      ) {
        setTimeout(() => {
          xVelocity = -sizeSnakes;
          yVelocity = 0;
        }, speed + 50);
      } else {
        if (check) {
          setTimeout(() => {
            xVelocity = -sizeSnakes;
            yVelocity = 0;
          }, speed);
        } else {
          xVelocity = -sizeSnakes;
          yVelocity = 0;
        }
      }
      check = true;
      break;
    // xVelocity = -sizeSnakes;
    // yVelocity = 0;

    case keyPressed == UP && !goingDown:
      if (
        snake[0].x == 0 ||
        snake[0].x < 0 ||
        snake[0].x >= gameWidth ||
        snake[0].y == 0 ||
        snake[0].y < 0 ||
        snake[0].y >= gameHeight
      ) {
        setTimeout(() => {
          xVelocity = 0;
          yVelocity = -sizeSnakes;
        }, speed + 50);
      } else {
        if (check) {
          setTimeout(() => {
            xVelocity = 0;
            yVelocity = -sizeSnakes;
          }, speed);
        } else {
          if (check) {
            setTimeout(() => {
              xVelocity = 0;
              yVelocity = -sizeSnakes;
            }, speed);
          } else {
            xVelocity = 0;
            yVelocity = -sizeSnakes;
          }
        }
      }
      check = true;
      // xVelocity = 0;
      // yVelocity = -sizeSnakes;
      break;
    case keyPressed == RIGHT && !goingLeft:
      if (
        snake[0].x == 0 ||
        snake[0].x < 0 ||
        snake[0].x >= gameWidth ||
        snake[0].y == 0 ||
        snake[0].y < 0 ||
        snake[0].y >= gameHeight
      ) {
        setTimeout(() => {
          xVelocity = sizeSnakes;
          yVelocity = 0;
        }, speed + 50);
      } else {
        if (check) {
          setTimeout(() => {
            xVelocity = sizeSnakes;
            yVelocity = 0;
          }, speed);
        } else {
          xVelocity = sizeSnakes;
          yVelocity = 0;
        }
      }
      check = true;
      // xVelocity = sizeSnakes;
      // yVelocity = 0;
      break;
    case keyPressed == DOWN && !goingUp:
      if (
        snake[0].x == 0 ||
        snake[0].x < 0 ||
        snake[0].x >= gameWidth ||
        snake[0].y == 0 ||
        snake[0].y < 0 ||
        snake[0].y >= gameHeight
      ) {
        setTimeout(() => {
          xVelocity = 0;
          yVelocity = sizeSnakes;
        }, speed + 50);
      } else {
        if (check) {
          setTimeout(() => {
            xVelocity = 0;
            yVelocity = sizeSnakes;
          }, speed);
        } else {
          xVelocity = 0;
          yVelocity = sizeSnakes;
        }
      }
      check = true;
      break;
    // xVelocity = 0;
    // yVelocity = sizeSnakes;
    // break;
  }

  // switch (true) {
  //   case keyPressed == LEFT && !goingRight:
  //     xVelocity = -sizeSnakes;
  //     yVelocity = 0;
  //     break;
  //   case keyPressed == UP && !goingDown:
  //     xVelocity = 0;
  //     yVelocity = -sizeSnakes;
  //     break;
  //   case keyPressed == RIGHT && !goingLeft:
  //     xVelocity = sizeSnakes;
  //     yVelocity = 0;
  //     break;
  //   case keyPressed == DOWN && !goingUp:
  //     xVelocity = 0;
  //     yVelocity = sizeSnakes;
  //     break;
  // }
}

// changeDirectionWithButton(
function changeDirectionWithButton(event) {
  const goingUp = yVelocity == -sizeSnakes;
  const goingDown = yVelocity == sizeSnakes;
  const goingRight = xVelocity == sizeSnakes;
  const goingLeft = xVelocity == -sizeSnakes;

  switch (true) {
    case chooseDirection == 1 && !goingRight:
      if (
        snake[0].x == 0 ||
        snake[0].x < 0 ||
        snake[0].x >= gameWidth ||
        snake[0].y == 0 ||
        snake[0].y < 0 ||
        snake[0].y >= gameHeight
      ) {
        setTimeout(() => {
          xVelocity = -sizeSnakes;
          yVelocity = 0;
        }, speed + 50);
      } else {
        if (check) {
          setTimeout(() => {
            xVelocity = -sizeSnakes;
            yVelocity = 0;
          }, speed);
        } else {
          xVelocity = -sizeSnakes;
          yVelocity = 0;
        }
      }
      check = true;
      break;
    // xVelocity = -sizeSnakes;
    // yVelocity = 0;
    // break;
    case chooseDirection == 0 && !goingDown:
      if (
        snake[0].x == 0 ||
        snake[0].x < 0 ||
        snake[0].x >= gameWidth ||
        snake[0].y == 0 ||
        snake[0].y < 0 ||
        snake[0].y >= gameHeight
      ) {
        setTimeout(() => {
          xVelocity = 0;
          yVelocity = -sizeSnakes;
        }, speed + 50);
      } else {
        if (check) {
          setTimeout(() => {
            xVelocity = 0;
            yVelocity = -sizeSnakes;
          }, speed);
        } else {
          xVelocity = 0;
          yVelocity = -sizeSnakes;
        }
      }
      check = true;
      break;
    // xVelocity = 0;
    // yVelocity = -sizeSnakes;
    // break;
    case chooseDirection == 3 && !goingLeft:
      if (
        snake[0].x == 0 ||
        snake[0].x < 0 ||
        snake[0].x >= gameWidth ||
        snake[0].y == 0 ||
        snake[0].y < 0 ||
        snake[0].y >= gameHeight
      ) {
        setTimeout(() => {
          xVelocity = sizeSnakes;
          yVelocity = 0;
        }, speed + 50);
      } else {
        if (check) {
          setTimeout(() => {
            xVelocity = sizeSnakes;
            yVelocity = 0;
          }, speed);
        } else {
          xVelocity = sizeSnakes;
          yVelocity = 0;
        }
      }
      check = true;
      break;
    // xVelocity = sizeSnakes;
    // yVelocity = 0;
    // break;
    case chooseDirection == 2 && !goingUp:
      if (
        snake[0].x == 0 ||
        snake[0].x < 0 ||
        snake[0].x >= gameWidth ||
        snake[0].y == 0 ||
        snake[0].y < 0 ||
        snake[0].y >= gameHeight
      ) {
        setTimeout(() => {
          xVelocity = 0;
          yVelocity = sizeSnakes;
        }, speed + 50);
      } else {
        if (check) {
          setTimeout(() => {
            xVelocity = 0;
            yVelocity = sizeSnakes;
          }, speed);
        } else {
          xVelocity = 0;
          yVelocity = sizeSnakes;
        }
      }
      check = true;
      break;

    // xVelocity = 0;
    // yVelocity = sizeSnakes;
    // break;
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
  scoreText.textContent = 0;
  xVelocity = sizeSnakes;
  yVelocity = 0;
  snake = [
    { x: sizeSnakes * 5, y: 0 },
    { x: sizeSnakes * 4, y: 0 },
    { x: sizeSnakes * 3, y: 0 },
    { x: sizeSnakes * 2, y: 0 },
    { x: sizeSnakes, y: 0 },
    { x: 0, y: 0 },
  ];
  chooseDirection = undefined;
}

// ctx.font = "50px MV Boli";
// ctx.fillStyle = "black";
// ctx.textAlign = "center";
// ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
// running = false;
