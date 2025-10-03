const container = document.querySelector(".game-container");
const birb = document.querySelector(".birbs");
const upperPipe = document.querySelector(".upperpipe");
const lowerPipe = document.querySelector(".lowerpipe");
const gameOverText = document.querySelector(".game-over");

let y = 100;
let velocity = 0;
const gravity = 0.5;
const jump = -8;
let gameRunning = true;

// Container dimensions
const gameWidth = container.clientWidth;
const gameHeight = container.clientHeight;

// Initial pipe position
let pipeX = gameWidth;
const pipeSpeed = 2;

// --- RESET FUNCTION ---
function resetGame() {
  y = 100;
  velocity = 0;
  pipeX = gameWidth;
  gameRunning = true;
  gameOverText.style.display = "none";
  birb.style.top = `${y}px`;
  upperPipe.style.right = `${gameWidth - pipeX}px`;
  lowerPipe.style.right = `${gameWidth - pipeX}px`;
  gameLoop(); // restart the game loop
}

// --- SPACEBAR HANDLER ---
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameRunning) {
      velocity = jump;
    } else {
      resetGame(); // call the reusable reset function
    }
  }
});

// --- GAME LOOP ---
const gameLoop = () => {
  if (!gameRunning) return;

  velocity += gravity;
  y += velocity;

  if (y < 0) y = 0;
  birb.style.top = `${y}px`;

  // Move pipes
  pipeX -= pipeSpeed;
  upperPipe.style.right = `${gameWidth - pipeX}px`;
  lowerPipe.style.right = `${gameWidth - pipeX}px`;

  // Collision detection
  const birdRect = birb.getBoundingClientRect();
  const upperRect = upperPipe.getBoundingClientRect();
  const lowerRect = lowerPipe.getBoundingClientRect();

  if (
    (birdRect.left < upperRect.right &&
      birdRect.right > upperRect.left &&
      birdRect.top < upperRect.bottom) ||
    (birdRect.left < lowerRect.right &&
      birdRect.right > lowerRect.left &&
      birdRect.bottom > lowerRect.top) ||
    y + birb.offsetHeight > gameHeight
  ) {
    gameRunning = false;
    gameOverText.style.display = "block";
    return;
  }

  requestAnimationFrame(gameLoop);
};

// --- START THE GAME ---
gameLoop();
