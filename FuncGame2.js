// Select elements
const birdEl = document.querySelector(".birbs");
const gameArea = document.getElementById("container");

// Bird physics
let birdX = 100;
let birdY = 150;
let velocity = 0;
const gravity = 0.5;
const jumpStrength = -8;

// Game state
let isGameOver = false;
const pipeSpeed = 2;
const pipes = [];

// Controls
document.addEventListener("keydown", e => {
  if (e.code === "Space" || e.code === "ArrowUp") velocity = jumpStrength;
});

// Generate pipes dynamically
const generatePipes = () => {
  if (isGameOver) return;

  const gap = 180;
  const minPipeHeight = 70;
  const maxPipeHeight = gameArea.clientHeight - gap - minPipeHeight;
  const topPipeHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight)) + minPipeHeight;
  const bottomPipeHeight = gameArea.clientHeight - topPipeHeight - gap;

  const topPipe = document.createElement("div");
  topPipe.classList.add("upperpipe");
  topPipe.style.height = `${topPipeHeight}px`;
  topPipe.style.left = `${gameArea.clientWidth}px`;

  const bottomPipe = document.createElement("div");
  bottomPipe.classList.add("lowerpipe");
  bottomPipe.style.height = `${bottomPipeHeight}px`;
  bottomPipe.style.left = `${gameArea.clientWidth}px`;

  gameArea.appendChild(topPipe);
  gameArea.appendChild(bottomPipe);

  pipes.push({ top: topPipe, bottom: bottomPipe });
};

// Move pipes using forEach (your preference)
const movePipes = () => {
  pipes.forEach((pair, i) => {
    const { top, bottom } = pair;
    const newLeft = top.offsetLeft - pipeSpeed;

    top.style.left = `${newLeft}px`;
    bottom.style.left = `${newLeft}px`;

    // Remove pipes that are off-screen
    if (newLeft + top.offsetWidth < 0) {
      top.remove();
      bottom.remove();
      pipes.splice(i, 1);
    }
  });
};

// Collision detection
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
      console.log("💥 Hit a pipe!");
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

// Start generating pipes and running loop
setInterval(generatePipes, 2000);
requestAnimationFrame(gameLoop);
