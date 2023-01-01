const buttonReset = document.getElementById("button__reset");
const containerReset = document.getElementById("container__reset");

const wrapperPlay = document.getElementById("wrapper__play");
const buttonPause = document.getElementById("button__pause");

const buttonStart = document.getElementById("button__start");

const groupChooses = document.querySelectorAll(".choose");
const groupSpeeds = document.querySelectorAll(".speed");

const buttonRestart = document.getElementById("restart");
const containerLost = document.getElementById("container__lost");

buttonRestart.onclick = function () {
  containerLost.classList.remove("show");
};

groupChooses.forEach((groupChoose, index) => {
  groupChoose.onclick = function (e) {
    document.querySelector(".choose.show").classList.remove("show");
    groupChoose.classList.add("show");
  };
});

groupSpeeds.forEach((groupSpeed, index) => {
  groupSpeed.onclick = function (e) {
    document.querySelector(".speed.show").classList.remove("show");
    groupSpeed.classList.add("show");
  };
});

// open reset game
buttonReset.onclick = function () {
  containerReset.classList.add("show");
};

buttonStart.onclick = function () {
  containerReset.classList.remove("show");
};

// pause game
wrapperPlay.onclick = function () {
  wrapperPlay.classList.remove("show");
};

buttonPause.onclick = function () {
  wrapperPlay.classList.add("show");
};
