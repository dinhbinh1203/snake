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
const scoreText = document.querySelector("#scoreText");
const rankingGame = document.getElementById("rankingGame");
const btnVolume = document.getElementById("volume");
const buttonMoves = document.querySelectorAll(".button__move");
const countNumber = document.getElementById("countNumber");
const tools = document.getElementById("tools");
const sizeSnakes = 20;
const boardBackground = "pink";
const snakeColor = "#92400e";
const snakeBorder = "black";
const foodColor = "red";
let screenWidth = document.body.clientWidth;
let screenHeight = screen.height;
let valueWidth = Math.floor((screenWidth * 0.8) / sizeSnakes) * sizeSnakes;
let valueHeight = Math.floor((screenHeight * 0.6) / sizeSnakes) * sizeSnakes;
var audio = new Audio("assets/music.mp3");
tools.style.width = `${valueWidth}px`;
gameBoard.width = `${valueWidth}`;
gameBoard.height = `${valueHeight}`;
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

// Create body snake
function bodySnake(number) {
  let arr = [];
  for (let i = number - 1; i > -1; i--) {
    let obj = { x: sizeSnakes * i, y: 0 };
    arr.push(obj);
  }
  return arr;
}


class Snake {
  constructor() {
    this.running = false;
    this.xVelocity = sizeSnakes;
    this.yVelocity = 0;
    this.foodX;
    this.foodY;
    this.score = 0;
    this.body = bodySnake(5)
    this.speed;
    this.chooseDirection;
    this.check;
  }

  createFood() {
    function randomFood(min, max) {
      const randNum =
        Math.round((Math.random() * (max - min) + min) / sizeSnakes) *
        sizeSnakes;
      return randNum;
    }
    this.foodX = randomFood(0, gameWidth - sizeSnakes);
    this.foodY = randomFood(0, gameHeight - sizeSnakes);
  }

  moveSnake() {
    this.check = false;
    if (!this.running && !startGame.classList.value.includes("active")) {
      lostGame.classList.add("active");
      lostGameScore.textContent = scoreText.textContent;
    }

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

      let head = {
        x: this.body[0].x + this.xVelocity,
        y: this.body[0].y + this.yVelocity,
      };
      if (checkMode === 1) {
        switch (true) {
          case this.body[0].x >= gameWidth:
            this.xVelocity = sizeSnakes;
            this.yVelocity = 0;
            head = {
              x: this.xVelocity - sizeSnakes,
              y: this.body[0].y + this.yVelocity,
            };
            break;
          case this.body[0].x < 0:
            this.xVelocity = -sizeSnakes;
            head = {
              x: gameWidth + this.xVelocity,
              y: this.body[0].y + this.yVelocity,
            };
            break;
          case this.body[0].y >= gameHeight:
            this.yVelocity = sizeSnakes;
            head = {
              x: this.body[0].x + this.xVelocity,
              y: this.yVelocity - sizeSnakes,
            };
            break;
          case this.body[0].y < 0:
            this.xVelocity = 0;
            this.yVelocity = -sizeSnakes;
            head = {
              x: this.body[0].x + this.xVelocity,
              y: gameHeight + this.yVelocity,
            };
            break;
        }
      }
      this.body.unshift(head);

      if (this.body[0].x == this.foodX && this.body[0].y == this.foodY) {
        this.score += 1;
        scoreText.textContent = this.score;
        this.createFood();
      } else {
        this.body.pop();
      }
    }
  }
}

class Game {
  constructor(canvas) {
    this.snake = new Snake();
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  }

  clearGame() {
    this.context.fillStyle = boardBackground;
    this.context.fillRect(0, 0, gameWidth, gameHeight);
  }

  drawFood() {
    this.context.fillStyle = foodColor;
    this.context.fillRect(
      this.snake.foodX,
      this.snake.foodY,
      sizeSnakes,
      sizeSnakes
    );
  }

  drawSnake() {
    this.context.fillStyle = snakeColor;
    this.snake.body.forEach((snakePart) => {
      this.context.fillRect(snakePart.x, snakePart.y, sizeSnakes, sizeSnakes);
    });
  }

  checkGameOver() {
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
          this.snake.running = false;
          break;
        case this.snake.body[0].x < 0:
          this.snake.running = false;
          break;
        case this.snake.body[0].x >= gameWidth:
          this.snake.running = false;
          break;
        case this.snake.body[0].y < 0:
          this.snake.running = false;
          break;
        case this.snake.body[0].y >= gameHeight:
          this.snake.running = false;
          break;
      }
    }

    for (let i = 1; i < this.snake.body.length; i += 1) {
      if (
        this.snake.body[i].x == this.snake.body[0].x &&
        this.snake.body[i].y == this.snake.body[0].y
      ) {
        this.snake.running = false;
      }
    }
  }

  animation() {
    this.clearGame();
    this.drawFood();
    this.snake.moveSnake();
    this.drawSnake();
    this.checkGameOver();
    this.nextTick();
  }

  nextTick() {
    chooseSpeeds.forEach((chooseSpeed, index) => {
      if (chooseSpeed.classList.value.includes("active")) {
        if (index === 0) {
          this.snake.speed = 300;
        }
        if (index === 1) {
          this.snake.speed = 200;
        }
        if (index === 2) {
          this.snake.speed = 50;
        }
      }
    });
  }

  gameStart() {
    this.snake.running = true;
    this.snake.createFood();
    this.drawFood();
    this.nextTick();
  }

  resetGame() {
    this.gameStart();
    this.snake.score = 0;
    scoreText.textContent = 0;
    this.snake.xVelocity = sizeSnakes;
    this.snake.yVelocity = 0;
    this.snake.body = bodySnake(5)
    this.snake.chooseDirection = undefined;
  }
}

const game = new Game(gameBoard);

function changeDirectionWithKeyCode(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  // check if snake direction top and press down not game over
  const goingUp = game.snake.yVelocity == -sizeSnakes;
  const goingDown = game.snake.yVelocity == sizeSnakes;
  const goingRight = game.snake.xVelocity == sizeSnakes;
  const goingLeft = game.snake.xVelocity == -sizeSnakes;

  switch (true) {
    case keyPressed == LEFT && !goingRight:
      if (
        game.snake.body[0].x == 0 ||
        game.snake.body[0].x < 0 ||
        game.snake.body[0].x >= gameWidth ||
        game.snake.body[0].y == 0 ||
        game.snake.body[0].y < 0 ||
        game.snake.body[0].y >= gameHeight
      ) {
        setTimeout(() => {
          game.snake.xVelocity = -sizeSnakes;
          game.snake.yVelocity = 0;
        }, game.snake.speed + 50);
      } else {
        if (game.snake.check) {
          setTimeout(() => {
            game.snake.xVelocity = -sizeSnakes;
            game.snake.yVelocity = 0;
          }, game.snake.speed);
        } else {
          game.snake.xVelocity = -sizeSnakes;
          game.snake.yVelocity = 0;
        }
      }
      game.snake.check = true;
      break;

    case keyPressed == UP && !goingDown:
      if (
        game.snake.body[0].x == 0 ||
        game.snake.body[0].x < 0 ||
        game.snake.body[0].x >= gameWidth ||
        game.snake.body[0].y == 0 ||
        game.snake.body[0].y < 0 ||
        game.snake.body[0].y >= gameHeight
      ) {
        setTimeout(() => {
          game.snake.xVelocity = 0;
          game.snake.yVelocity = -sizeSnakes;
        }, game.snake.speed + 50);
      } else {
        if (game.snake.check) {
          setTimeout(() => {
            game.snake.xVelocity = 0;
            game.snake.yVelocity = -sizeSnakes;
          }, game.snake.speed);
        } else {
          if (game.snake.check) {
            setTimeout(() => {
              game.snake.xVelocity = 0;
              game.snake.yVelocity = -sizeSnakes;
            }, game.snake.speed);
          } else {
            game.snake.xVelocity = 0;
            game.snake.yVelocity = -sizeSnakes;
          }
        }
      }
      game.snake.check = true;

      break;
    case keyPressed == RIGHT && !goingLeft:
      if (
        game.snake.body[0].x == 0 ||
        game.snake.body[0].x < 0 ||
        game.snake.body[0].x >= gameWidth ||
        game.snake.body[0].y == 0 ||
        game.snake.body[0].y < 0 ||
        game.snake.body[0].y >= gameHeight
      ) {
        setTimeout(() => {
          game.snake.xVelocity = sizeSnakes;
          game.snake.yVelocity = 0;
        }, game.snake.speed + 50);
      } else {
        if (game.snake.check) {
          setTimeout(() => {
            game.snake.xVelocity = sizeSnakes;
            game.snake.yVelocity = 0;
          }, game.snake.speed);
        } else {
          game.snake.xVelocity = sizeSnakes;
          game.snake.yVelocity = 0;
        }
      }
      game.snake.check = true;

      break;
    case keyPressed == DOWN && !goingUp:
      if (
        game.snake.body[0].x == 0 ||
        game.snake.body[0].x < 0 ||
        game.snake.body[0].x >= gameWidth ||
        game.snake.body[0].y == 0 ||
        game.snake.body[0].y < 0 ||
        game.snake.body[0].y >= gameHeight
      ) {
        setTimeout(() => {
          game.snake.xVelocity = 0;
          game.snake.yVelocity = sizeSnakes;
        }, game.snake.speed + 50);
      } else {
        if (game.snake.check) {
          setTimeout(() => {
            game.snake.xVelocity = 0;
            game.snake.yVelocity = sizeSnakes;
          }, game.snake.speed);
        } else {
          game.snake.xVelocity = 0;
          game.snake.yVelocity = sizeSnakes;
        }
      }
      game.snake.check = true;
      break;
  }
}

function changeDirectionWithButton(event) {
  const goingUp = game.snake.yVelocity == -sizeSnakes;
  const goingDown = game.snake.yVelocity == sizeSnakes;
  const goingRight = game.snake.xVelocity == sizeSnakes;
  const goingLeft = game.snake.xVelocity == -sizeSnakes;

  switch (true) {
    case game.snake.chooseDirection == 1 && !goingRight:
      if (
        game.snake.body[0].x == 0 ||
        game.snake.body[0].x < 0 ||
        game.snake.body[0].x >= gameWidth ||
        game.snake.body[0].y == 0 ||
        game.snake.body[0].y < 0 ||
        game.snake.body[0].y >= gameHeight
      ) {
        setTimeout(() => {
          game.snake.xVelocity = -sizeSnakes;
          game.snake.yVelocity = 0;
        }, game.snake.speed + 50);
      } else {
        if (game.snake.check) {
          setTimeout(() => {
            game.snake.xVelocity = -sizeSnakes;
            game.snake.yVelocity = 0;
          }, game.snake.speed);
        } else {
          game.snake.xVelocity = -sizeSnakes;
          game.snake.yVelocity = 0;
        }
      }
      game.snake.check = true;
      break;

    case game.snake.chooseDirection == 0 && !goingDown:
      if (
        game.snake.body[0].x == 0 ||
        game.snake.body[0].x < 0 ||
        game.snake.body[0].x >= gameWidth ||
        game.snake.body[0].y == 0 ||
        game.snake.body[0].y < 0 ||
        game.snake.body[0].y >= gameHeight
      ) {
        setTimeout(() => {
          game.snake.xVelocity = 0;
          game.snake.yVelocity = -sizeSnakes;
        }, game.snake.speed + 50);
      } else {
        if (game.snake.check) {
          setTimeout(() => {
            game.snake.xVelocity = 0;
            game.snake.yVelocity = -sizeSnakes;
          }, game.snake.speed);
        } else {
          game.snake.xVelocity = 0;
          game.snake.yVelocity = -sizeSnakes;
        }
      }
      game.snake.check = true;
      break;

    case game.snake.chooseDirection == 3 && !goingLeft:
      if (
        game.snake.body[0].x == 0 ||
        game.snake.body[0].x < 0 ||
        game.snake.body[0].x >= gameWidth ||
        game.snake.body[0].y == 0 ||
        game.snake.body[0].y < 0 ||
        game.snake.body[0].y >= gameHeight
      ) {
        setTimeout(() => {
          game.snake.xVelocity = sizeSnakes;
          game.snake.yVelocity = 0;
        }, game.snake.speed + 50);
      } else {
        if (game.snake.check) {
          setTimeout(() => {
            game.snake.xVelocity = sizeSnakes;
            game.snake.yVelocity = 0;
          }, game.snake.speed);
        } else {
          game.snake.xVelocity = sizeSnakes;
          game.snake.yVelocity = 0;
        }
      }
      game.snake.check = true;
      break;

    case game.snake.chooseDirection == 2 && !goingUp:
      if (
        game.snake.body[0].x == 0 ||
        game.snake.body[0].x < 0 ||
        game.snake.body[0].x >= gameWidth ||
        game.snake.body[0].y == 0 ||
        game.snake.body[0].y < 0 ||
        game.snake.body[0].y >= gameHeight
      ) {
        setTimeout(() => {
          game.snake.xVelocity = 0;
          game.snake.yVelocity = sizeSnakes;
        }, game.snake.speed + 50);
      } else {
        if (game.snake.check) {
          setTimeout(() => {
            game.snake.xVelocity = 0;
            game.snake.yVelocity = sizeSnakes;
          }, game.snake.speed);
        } else {
          game.snake.xVelocity = 0;
          game.snake.yVelocity = sizeSnakes;
        }
      }
      game.snake.check = true;
      break;
  }
}

window.addEventListener("keydown", changeDirectionWithKeyCode);
window.addEventListener("click", changeDirectionWithButton);
window.addEventListener("resize", (event) => {
  screenWidth = event.currentTarget.innerWidth;
  screenWidth = event.currentTarget.innerHeight;
  valueWidth = Math.floor((screenWidth * 0.8) / sizeSnakes) * sizeSnakes;
  valueHeight = Math.floor((screenHeight * 0.6) / sizeSnakes) * sizeSnakes;
  tools.style.width = `${valueWidth}px`;
  gameBoard.width = `${valueWidth}`;
  gameBoard.height = `${valueHeight}`;
});

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

// On Off Volume
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
    game.snake.chooseDirection = index;
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

var fpsInterval, now, then, timeElapsed;

// On off container startGame
btnStart.onclick = function () {
  startGame.classList.remove("active");
  game.resetGame();

  if (game.snake.running) {
    startAnimating(game.snake.speed);
    function startAnimating(fps) {
      fpsInterval = fps;
      then = Date.now();
      animate();
    }

    function animate() {
      requestAnimationFrame(animate);
      now = Date.now();
      timeElapsed = now - then;
      if (timeElapsed > fpsInterval) {
        then = now - (timeElapsed % fpsInterval);
        game.animation();
      }
    }
  }
};

btnReset.onclick = function () {
  game.snake.running = false;
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

// Play Again
btnPlayAgain.onclick = function () {
  lostGame.classList.remove("active");
  game.resetGame();
};
