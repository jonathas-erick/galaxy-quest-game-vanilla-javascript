const grid = document.querySelector(".grid");
const resultsDisplay = document.querySelector(".resultsDisplay");
const restartButton = document.getElementById("restartButton");
let currentDefenderIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let goingRight = true;
let vel = 150;
let invadersDestroyed = [];
let score = 0;

for (let i = 0; i < 225; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
}
const squares = Array.from(document.querySelectorAll(".grid div"));

const invaders = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const draw = () => {
  for (let i = 0; i < invaders.length; i++) {
    if (!invadersDestroyed.includes(i)) {
      squares[invaders[i]].classList.add("invader");
    }
  }
};

draw();

const remove = () => {
  for (let i = 0; i < invaders.length; i++) {
    squares[invaders[i]].classList.remove("invader");
  }
};

const moveDefender = (e) => {
  squares[currentDefenderIndex].classList.remove("defender");
  switch (e.key) {
    case "ArrowLeft":
      if (currentDefenderIndex % width !== 0) currentDefenderIndex -= 1;
      break;
    case "ArrowRight":
      if (currentDefenderIndex % width < width - 1) currentDefenderIndex += 1;
      break;
  }
  squares[currentDefenderIndex].classList.add("defender");
};

squares[currentDefenderIndex].classList.add("defender");

document.addEventListener("keydown", moveDefender);

const moveInvaders = () => {
  const leftEdge = invaders[0] % width === 0;
  const rightEdge = invaders[invaders.length - 1] % width === width - 1;
  remove();
  if (rightEdge && goingRight) {
    for (let i = 0; i < invaders.length; i++) {
      invaders[i] += width + 1;
      direction = -1;
      goingRight = false;
    }
  }

  if (leftEdge && !goingRight) {
    for (let i = 0; i < invaders.length; i++) {
      invaders[i] += width - 1;
      direction = 1;
      goingRight = true;
    }
  }

  for (let i = 0; i < invaders.length; i++) {
    invaders[i] += direction;
  }
  draw();
  if (squares[currentDefenderIndex].classList.contains("invader", "defender")) {
    resultsDisplay.innerHTML = "GAME OVER";
    clearInterval(invadersId);
  }
  for (let i = 0; i < invaders.length; i++) {
    if (invaders[i] >= squares.length - 1) {
      resultsDisplay.innerHTML = "GAME OVER";
      clearInterval(invadersId);
    }
  }

  if (invadersDestroyed.length === invaders.length) {
    resultsDisplay.innerHTML = "YOU WIN! 🏆";
    clearInterval(invadersId);
  }
};

invadersId = setInterval(moveInvaders, vel);

const shoot = (e) => {
  let laserId;
  let currentLaserIndexAux = currentDefenderIndex;
  function moveLaser() {
    squares[currentLaserIndexAux].classList.remove("laser");
    currentLaserIndexAux -= width;
    squares[currentLaserIndexAux].classList.add("laser");

    if (squares[currentLaserIndexAux].classList.contains("invader")) {
      squares[currentLaserIndexAux].classList.remove("laser");
      squares[currentLaserIndexAux].classList.remove("invader");
      squares[currentLaserIndexAux].classList.add("boom");

      setTimeout(
        () => squares[currentLaserIndexAux].classList.remove("boom"),
        vel
      );
      clearInterval(laserId);
      const invaderDestruction = invaders.indexOf(currentLaserIndexAux);
      invadersDestroyed.push(invaderDestruction);
      score++;
      resultsDisplay.innerHTML = `🚀 Score: ${score}`;
    }
  }
  switch (e.key) {
    case "ArrowUp":
      laserId = setInterval(moveLaser, vel);
  }
};
document.addEventListener("keydown", shoot);
