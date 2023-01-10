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
var screenWidth = document.body.clientWidth;
var screenHeight = screen.height;
var valueWidth = Math.floor((screenWidth * 0.8) / sizeSnakes) * sizeSnakes;
var valueHeight = Math.floor((screenHeight * 0.6) / sizeSnakes) * sizeSnakes;
var audio = new Audio("assets/music.mp3");
tools.style.width = `${valueWidth}px`;
gameBoard.width = `${valueWidth}`;
gameBoard.height = `${valueHeight}`;
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
var fpsInterval, now, then, timeElapsed;
var checkMode;

function checkModeTwo(body) {
  if (
    body[0].x == 0 ||
    body[0].x < 0 ||
    body[0].x >= gameWidth ||
    body[0].y == 0 ||
    body[0].y < 0 ||
    body[0].y >= gameHeight
  ) {
    return true;
  }
  return false;
}
// Create body snake
function bodySnake(number) {
  let arr = [];
  for (let i = number - 1; i > -1; i--) {
    let obj = { x: sizeSnakes * i, y: 0 };
    arr.push(obj);
  }
  return arr;
}

class Food {
  constructor(context) {
    this.foodX;
    this.foodY;
    this.context = context;
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

  drawFood() {
    this.context.fillStyle = foodColor;
    this.context.fillRect(this.foodX, this.foodY, sizeSnakes, sizeSnakes);
  }
}

class Snake {
  constructor(context) {
    this.running = false;
    this.xVelocity = sizeSnakes;
    this.yVelocity = 0;
    this.score = 0;
    this.body = bodySnake(5);
    this.speed;
    this.chooseDirection;
    // Biến kiểm tra có bấm 2 nút liên tục không
    this.checkPressConsecutive;
    this.foodSnake = new Food(context);
  }

  checkSpeedSnake() {
    chooseSpeeds.forEach((chooseSpeed, index) => {
      if (chooseSpeed.classList.value.includes("active")) {
        // Speed slow
        if (index === 0) {
          this.speed = 300;
        }
        // Speed normal
        if (index === 1) {
          this.speed = 200;
        }
        // Speed fast
        if (index === 2) {
          this.speed = 50;
        }
      }
    });
  }

  moveSnake() {
    this.checkSpeedSnake();
    this.checkPressConsecutive = false;
    if (!this.running && !startGame.classList.value.includes("active")) {
      lostGame.classList.add("active");
      lostGameScore.textContent = scoreText.textContent;
    }

    if (
      !continueGame.classList.value.includes("active") &&
      !countNumber.classList.value.includes("active")
    ) {
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
      // Thêm phần tử head vào vị trí đầu tiên của mảng Snake
      this.body.unshift(head);

      if (
        this.body[0].x == this.foodSnake.foodX &&
        this.body[0].y == this.foodSnake.foodY
      ) {
        // Nếu vị trí phần tử đầu tiên của body trùng với vị trí của food thì
        // score cộng thêm 1
        // tạo ra food mới
        this.score += 1;
        scoreText.textContent = this.score;
        this.foodSnake.createFood();
      } else {
        // Nếu vị trí phần tử đầu tiên của body không trùng với vị trí của food thì
        // xóa bỏ vị trí cuối cùng trong body
        this.body.pop();
      }
    }
  }

  changeDirectionWithKeyCode() {
    window.addEventListener("keydown", (event) => {
      const keyPressed = event.keyCode;
      const LEFT = 37;
      const UP = 38;
      const RIGHT = 39;
      const DOWN = 40;

      // check if snake direction dowm and press up not game over
      const goingUp = this.yVelocity == -sizeSnakes;
      // check if snake direction top and press down not game over
      const goingDown = this.yVelocity == sizeSnakes;
      // check if snake direction left and press right not game over
      const goingRight = this.xVelocity == sizeSnakes;
      // check if snake direction right and press left not game over
      const goingLeft = this.xVelocity == -sizeSnakes;

      switch (true) {
        case keyPressed == LEFT && !goingRight:
          if (checkModeTwo(this.body)) {
            setTimeout(() => {
              this.xVelocity = -sizeSnakes;
              this.yVelocity = 0;
            }, this.speed + 50);
          } else {
            // Nếu bấm 2 nút liên tục thì đợi thực thi hành động 1 mới thực thi hành động 2
            if (this.check) {
              setTimeout(() => {
                this.xVelocity = -sizeSnakes;
                this.yVelocity = 0;
              }, this.speed);
            } else {
              this.xVelocity = -sizeSnakes;
              this.yVelocity = 0;
            }
          }
          this.checkPressConsecutive = true;
          break;

        case keyPressed == UP && !goingDown:
          if (checkModeTwo(this.body)) {
            setTimeout(() => {
              this.xVelocity = 0;
              this.yVelocity = -sizeSnakes;
            }, this.speed + 50);
          } else {
            if (this.check) {
              setTimeout(() => {
                this.xVelocity = 0;
                this.yVelocity = -sizeSnakes;
              }, this.speed);
            } else {
               // Nếu bấm 2 nút liên tục thì đợi thực thi hành động 1 mới thực thi hành động 2
              if (this.check) {
                setTimeout(() => {
                  this.xVelocity = 0;
                  this.yVelocity = -sizeSnakes;
                }, this.speed);
              } else {
                this.xVelocity = 0;
                this.yVelocity = -sizeSnakes;
              }
            }
          }
          this.checkPressConsecutive = true;

          break;
        case keyPressed == RIGHT && !goingLeft:
          if (checkModeTwo(this.body)) {
            setTimeout(() => {
              this.xVelocity = sizeSnakes;
              this.yVelocity = 0;
            }, this.speed + 50);
          } else {
             // Nếu bấm 2 nút liên tục thì đợi thực thi hành động 1 mới thực thi hành động 2
            if (this.check) {
              setTimeout(() => {
                this.xVelocity = sizeSnakes;
                this.yVelocity = 0;
              }, this.speed);
            } else {
              this.xVelocity = sizeSnakes;
              this.yVelocity = 0;
            }
          }
          this.checkPressConsecutive = true;

          break;
        case keyPressed == DOWN && !goingUp:
          if (checkModeTwo(this.body)) {
            setTimeout(() => {
              this.xVelocity = 0;
              this.yVelocity = sizeSnakes;
            }, this.speed + 50);
          } else {
             // Nếu bấm 2 nút liên tục thì đợi thực thi hành động 1 mới thực thi hành động 2
            if (this.check) {
              setTimeout(() => {
                this.xVelocity = 0;
                this.yVelocity = sizeSnakes;
              }, this.speed);
            } else {
              this.xVelocity = 0;
              this.yVelocity = sizeSnakes;
            }
          }
          this.checkPressConsecutive = true;
          break;
      }
    });
  }

  changeDirectionWithButton() {
    window.addEventListener("click", (event) => {
      // check if snake direction dowm and press up not game over
      const goingUp = this.yVelocity == -sizeSnakes;
      // check if snake direction top and press down not game over
      const goingDown = this.yVelocity == sizeSnakes;
      // check if snake direction left and press right not game over
      const goingRight = this.xVelocity == sizeSnakes;
      // check if snake direction right and press left not game over
      const goingLeft = this.xVelocity == -sizeSnakes;

      switch (true) {
        case this.chooseDirection == 1 && !goingRight:
          if (checkModeTwo(this.body)) {
            setTimeout(() => {
              this.xVelocity = -sizeSnakes;
              this.yVelocity = 0;
            }, this.speed + 50);
          } else {
             // Nếu bấm 2 nút liên tục thì đợi thực thi hành động 1 mới thực thi hành động 2
            if (this.check) {
              setTimeout(() => {
                this.xVelocity = -sizeSnakes;
                this.yVelocity = 0;
              }, this.speed);
            } else {
              this.xVelocity = -sizeSnakes;
              this.yVelocity = 0;
            }
          }
          this.checkPressConsecutive = true;
          break;

        case this.chooseDirection == 0 && !goingDown:
          if (checkModeTwo(this.body)) {
            setTimeout(() => {
              this.xVelocity = 0;
              this.yVelocity = -sizeSnakes;
            }, this.speed + 50);
          } else {
             // Nếu bấm 2 nút liên tục thì đợi thực thi hành động 1 mới thực thi hành động 2
            if (this.check) {
              setTimeout(() => {
                this.xVelocity = 0;
                this.yVelocity = -sizeSnakes;
              }, this.speed);
            } else {
              this.xVelocity = 0;
              this.yVelocity = -sizeSnakes;
            }
          }
          this.checkPressConsecutive = true;
          break;

        case this.chooseDirection == 3 && !goingLeft:
          if (checkModeTwo(this.body)) {
            setTimeout(() => {
              this.xVelocity = sizeSnakes;
              this.yVelocity = 0;
            }, this.speed + 50);
          } else {
             // Nếu bấm 2 nút liên tục thì đợi thực thi hành động 1 mới thực thi hành động 2
            if (this.check) {
              setTimeout(() => {
                this.xVelocity = sizeSnakes;
                this.yVelocity = 0;
              }, this.speed);
            } else {
              this.xVelocity = sizeSnakes;
              this.yVelocity = 0;
            }
          }
          this.checkPressConsecutive = true;
          break;

        case this.chooseDirection == 2 && !goingUp:
          if (checkModeTwo(this.body)) {
            setTimeout(() => {
              this.xVelocity = 0;
              this.yVelocity = sizeSnakes;
            }, this.speed + 50);
          } else {
             // Nếu bấm 2 nút liên tục thì đợi thực thi hành động 1 mới thực thi hành động 2
            if (this.check) {
              setTimeout(() => {
                this.xVelocity = 0;
                this.yVelocity = sizeSnakes;
              }, this.speed);
            } else {
              this.xVelocity = 0;
              this.yVelocity = sizeSnakes;
            }
          }
          this.checkPressConsecutive = true;
          break;
      }
    });
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.snake = new Snake(this.context);
  }

  clearGame() {
    this.context.fillStyle = boardBackground;
    this.context.fillRect(0, 0, gameWidth, gameHeight);
  }

  drawSnake() {
    this.context.fillStyle = snakeColor;
    this.snake.body.forEach((snakePart) => {
      this.context.fillRect(snakePart.x, snakePart.y, sizeSnakes, sizeSnakes);
    });
  }

  checkGameOver() {

    // Với mode 1 đụng vô khung thành die
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

    // Đụng thân rắn die
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
    this.snake.foodSnake.drawFood(this.context);
    this.snake.moveSnake();
    this.drawSnake();
    this.checkGameOver();
    this.snake.checkSpeedSnake();
  }

  gameStart() {
    this.snake.running = true;
    this.snake.foodSnake.createFood();
    this.snake.foodSnake.drawFood(this.context);
    this.snake.checkSpeedSnake();
  }

  resetGame() {
    this.gameStart();
    this.snake.score = 0;
    scoreText.textContent = 0;
    this.snake.xVelocity = sizeSnakes;
    this.snake.yVelocity = 0;
    this.snake.body = bodySnake(5);
    this.snake.chooseDirection = undefined;
  }
}

const game = new Game(gameBoard);

// Thay đổi kích thước canvas khi thay đổi kích thước màn hình
window.addEventListener("resize", (event) => {
  screenWidth = event.currentTarget.innerWidth;
  screenWidth = event.currentTarget.innerHeight;
  valueWidth = Math.floor((screenWidth * 0.8) / sizeSnakes) * sizeSnakes;
  valueHeight = Math.floor((screenHeight * 0.6) / sizeSnakes) * sizeSnakes;
  tools.style.width = `${valueWidth}px`;
  gameBoard.width = `${valueWidth}`;
  gameBoard.height = `${valueHeight}`;
});

// set time after click continue
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
    checkMode = index;
  };
});

// change speed
chooseSpeeds.forEach((chooseSpeed, index) => {
  chooseSpeed.onclick = function (e) {
    document.querySelector(".choose__speed.active").classList.remove("active");
    chooseSpeed.classList.add("active");
  };
});


// On off startGame
btnStart.onclick = function () {
  startGame.classList.remove("active");
  game.resetGame();
  game.snake.changeDirectionWithKeyCode();
  game.snake.changeDirectionWithButton();

  chooseModes.forEach((chooseMode, index) => {
    if (chooseMode.classList.value.includes("active")) {
      checkMode = index;
    }
  });

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

// On off continueGame
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
