// Grab elements
const birdEl = document.querySelector(".birbs");
const gameArea = document.getElementById("container");

// Bird physics
let birdX = 100;
let birdY = 100;
let velocity = 0;
const gravity = 0.5;
const jumpStrength = -8;

// Game state
let isGameOver = false;
const pipeSpeed = 2;
const pipes = []; // active pipes

// Jump
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    velocity = jumpStrength;
  }
});

// Pipe generator
const generatePipes = () => {
  if (isGameOver) return;

  const gap = 140;
  const minPipeHeight = 50;
  const maxPipeHeight = gameArea.clientHeight - gap - minPipeHeight;
  const topPipeHeight =
    Math.floor(Math.random() * (maxPipeHeight - minPipeHeight)) + minPipeHeight;
  const bottomPipeHeight = gameArea.clientHeight - topPipeHeight - gap;

  const topPipe = document.createElement("div");
  topPipe.className = "upperpipe";
  topPipe.style.height = `${topPipeHeight}px`;
  topPipe.style.left = `${gameArea.clientWidth}px`;

  const bottomPipe = document.createElement("div");
  bottomPipe.className = "lowerpipe";
  bottomPipe.style.height = `${bottomPipeHeight}px`;
  bottomPipe.style.left = `${gameArea.clientWidth}px`;

  gameArea.appendChild(topPipe);
  gameArea.appendChild(bottomPipe);

  pipes.push({ top: topPipe, bottom: bottomPipe });
};

// Move pipes
const movePipes = () => {
  pipes.forEach((pipePair, index) => {
    const { top, bottom } = pipePair;
    const newLeft = top.offsetLeft - pipeSpeed;

    top.style.left = `${newLeft}px`;
    bottom.style.left = `${newLeft}px`;

    // remove off-screen pipes
    if (newLeft + top.offsetWidth < 0) {
      top.remove();
      bottom.remove();
      pipes.splice(index, 1); // works inside forEach because splice changes array in-place
    }
  });
};

// Collision check
const checkCollision = () => {
  const birdRect = birdEl.getBoundingClientRect();

  pipes.forEach(({ top, bottom }) => {
    const topRect = top.getBoundingClientRect();
    const bottomRect = bottom.getBoundingClientRect();

    if (
      (birdRect.left < topRect.right &&
        birdRect.right > topRect.left &&
        birdRect.top < topRect.bottom) ||
      (birdRect.left < bottomRect.right &&
        birdRect.right > bottomRect.left &&
        birdRect.bottom > bottomRect.top)
    ) {
      isGameOver = true;
      console.log("Hit a pipe!");
    }
  });

  if (birdY + birdEl.offsetHeight >= gameArea.clientHeight) {
    isGameOver = true;
    console.log("Hit the ground!");
  }
};

// Main loop
const gameLoop = () => {
  if (!isGameOver) {
    velocity += gravity;
    birdY += velocity;

    birdEl.style.top = `${birdY}px`;
    birdEl.style.left = `${birdX}px`;

    checkCollision();
    movePipes();

    requestAnimationFrame(gameLoop);
  } else {
    console.log("Game Over!");
  }
};

// Start
setInterval(generatePipes, 2000);
requestAnimationFrame(gameLoop);
