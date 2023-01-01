// choose__mode
const chooseModes = document.querySelectorAll(".choose__mode");
// choose__speed
const chooseSpeeds = document.querySelectorAll(".choose__speed");
// btnStart
const btnStart = document.getElementById("btnStart");
// container startGame
const startGame = document.getElementById("startGame");
// btnReset
const btnReset = document.getElementById("button__reset");

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

// Display none container startGame
btnStart.onclick = function () {
  startGame.classList.remove("active");
};

// Display flex container startGame
btnReset.onclick = function () {
  startGame.classList.add("active");
};
