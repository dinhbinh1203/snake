// const chooseModes = document.querySelectorAll(".choose__mode");
// const chooseSpeeds = document.querySelectorAll(".choose__speed");
// const btnStart = document.getElementById("btnStart");
// const startGame = document.getElementById("startGame");
// const btnReset = document.getElementById("button__reset");
// const continueGame = document.getElementById("continueGame");
// const btnContinueGame = document.getElementById("btnContinueGame");
// const btnPause = document.getElementById("button__pause");
// const lostGame = document.getElementById("lostGame");
// const lostGameScore = document.getElementById("lostGame__score");
// const btnPlayAgain = document.getElementById("btnPlayAgain");
// const gameBoard = document.querySelector("#gameBoard");
// const context = gameBoard.getContext("2d");
// const scoreText = document.querySelector("#scoreText");
// const gameWidth = gameBoard.width;
// const gameHeight = gameBoard.height;
// const boardBackground = "pink";
// const snakeColor = "#92400e";
// const snakeBorder = "black";
// const foodColor = "red";
// const unitSize = 20;
// let running = false;
// let xVelocity = unitSize;
// let yVelocity = 0;
// let foodX;
// let foodY;
// let score = 0;
// let snake = [
//   { x: unitSize * 4, y: 0 },
//   { x: unitSize * 3, y: 0 },
//   { x: unitSize * 2, y: 0 },
//   { x: unitSize, y: 0 },
//   { x: 0, y: 0 },
// ];
// let speed;
// // change mode
// chooseModes.forEach((chooseMode, index) => {
//   chooseMode.onclick = function (e) {
//     document.querySelector(".choose__mode.active").classList.remove("active");
//     chooseMode.classList.add("active");
//   };
// });

// // change speed
// chooseSpeeds.forEach((chooseSpeed, index) => {
//   chooseSpeed.onclick = function (e) {
//     document.querySelector(".choose__speed.active").classList.remove("active");
//     chooseSpeed.classList.add("active");
//   };
// });

// // Display none container startGame
// btnStart.onclick = function () {
//   startGame.classList.remove("active");
//   resetGame();
// };

// // Display flex container startGame
// btnReset.onclick = function () {
//   startGame.classList.add("active");
// };

// // Display none container continueGame
// btnContinueGame.onclick = function () {
//   continueGame.classList.remove("active");
// };

// // display flex container continueGame
// btnPause.onclick = function () {
//   continueGame.classList.add("active");
// };



// window.addEventListener("keydown", changeDirection);

// function gameStart() {
//   running = true;
//   scoreText.textContent = score;
//   createFood();
//   drawFood();
//   nextTick();
// }

// function nextTick() {
//   chooseSpeeds.forEach((chooseSpeed, index) => {
//     if (chooseSpeed.classList.value.includes("active")) {
//       if (index === 0) {
//         speed = 300;
//       }
//       if (index === 1) {
//         speed = 150;
//       }
//       if (index === 2) {
//         speed = 50;
//       }
//     }
//   });

//   if (running) {
//     setTimeout(() => {
//       clearBoard();
//       drawFood();
//       moveSnake();
//       drawSnake();
//       checkGameOver();
//       nextTick();
//     }, speed);
//   } else {
//     if (!startGame.classList.value.includes("active")) {
//       displayGameOver();
//     }
//   }
// }
// function clearBoard() {
//   context.fillStyle = boardBackground;
//   context.fillRect(0, 0, gameWidth, gameHeight);
// }
// function createFood() {
//   function randomFood(min, max) {
//     const randNum =
//       Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
//     return randNum;
//   }
//   foodX = randomFood(0, gameWidth - unitSize);
//   foodY = randomFood(0, gameHeight - unitSize);
// }
// function drawFood() {
//   context.fillStyle = foodColor;
//   context.fillRect(foodX, foodY, unitSize, unitSize);
// }
// function moveSnake() {
//   if (!continueGame.classList.value.includes("active")) {
//     let checkMode;
//     chooseModes.forEach((chooseMode, index) => {
//       if (chooseMode.classList.value.includes("active")) {
//         checkMode = index;
//       }
//     });

//     let head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
//     if (checkMode === 1) {
//       if (snake[0].x >= gameWidth) {
//         xVelocity = unitSize;
//         yVelocity = 0;
//         head = { x: 0 + xVelocity - unitSize, y: snake[0].y + yVelocity };
//       }

//       if (snake[0].x < 0) {
//         xVelocity = -unitSize;
//         head = { x: gameWidth + xVelocity, y: snake[0].y + yVelocity };
//       }

//       if (snake[0].y > gameHeight) {
//         xVelocity = 0;
//         yVelocity = unitSize;
//         head = { x: snake[0].x + xVelocity, y: 0 + yVelocity - unitSize };
//       }

//       if (snake[0].y < 0) {
//         // xVelocity = 0;
//         yVelocity = -unitSize;
//         head = { x: snake[0].x + xVelocity, y: gameHeight + yVelocity };
//       }
//     }
//     snake.unshift(head);

//     if (snake[0].x == foodX && snake[0].y == foodY) {
//       score += 1;
//       scoreText.textContent = score;
//       createFood();
//     } else {
//       snake.pop();
//     }
//   }
// }

// function drawSnake() {
//   context.fillStyle = snakeColor;
//   snake.forEach((snakePart) => {
//     context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
//   });
// }

// function changeDirection(event) {
//   const keyPressed = event.keyCode;
//   const LEFT = 37;
//   const UP = 38;
//   const RIGHT = 39;
//   const DOWN = 40;

//   const goingUp = yVelocity == -unitSize;
//   const goingDown = yVelocity == unitSize;
//   const goingRight = xVelocity == unitSize;
//   const goingLeft = xVelocity == -unitSize;
//   switch (true) {
//     case keyPressed == LEFT && !goingRight:
//       xVelocity = -unitSize;
//       yVelocity = 0;
//       break;
//     case keyPressed == UP && !goingDown:
//       xVelocity = 0;
//       yVelocity = -unitSize;
//       break;
//     case keyPressed == RIGHT && !goingLeft:
//       xVelocity = unitSize;
//       yVelocity = 0;
//       break;
//     case keyPressed == DOWN && !goingUp:
//       xVelocity = 0;
//       yVelocity = unitSize;
//       break;
//   }
// }

// function checkGameOver() {
//   let checkMode;
//   chooseModes.forEach((chooseMode, index) => {
//     if (chooseMode.classList.value.includes("active")) {
//       checkMode = index;
//     }
//   });
//   if (checkMode === 0) {
//     switch (true) {
//       case startGame.classList.value.includes("active"):
//         lostGame.classList.remove("active");
//         running = false;
//         break;
//       case snake[0].x < 0:
//         running = false;
//         break;
//       case snake[0].x >= gameWidth:
//         running = false;
//         break;
//       case snake[0].y < 0:
//         running = false;
//         break;
//       case snake[0].y >= gameHeight:
//         running = false;
//         break;
//     }
//   }

//   for (let i = 1; i < snake.length; i += 1) {
//     if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
//       running = false;
//     }
//   }
// }
// function displayGameOver() {
//   lostGame.classList.add("active");
//   lostGameScore.textContent = scoreText.textContent;
//   btnPlayAgain.onclick = function () {
//     lostGame.classList.remove("active");
//     resetGame();
//   };
// }

// function resetGame() {
//   score = 0;
//   xVelocity = unitSize;
//   yVelocity = 0;

//   snake = [
//     { x: unitSize * 4, y: 0 },
//     { x: unitSize * 3, y: 0 },
//     { x: unitSize * 2, y: 0 },
//     { x: unitSize, y: 0 },
//     { x: 0, y: 0 },
//   ];
//   gameStart();
// }
