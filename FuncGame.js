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
document.addEventListener("keydown", (controls) => {
  if (controls.code === "Space" || controls.code === "ArrowUp") {
    velocity = jumpStrength;
  }
});

// Pipe generator
const generatePipes = () => {
  if (isGameOver) return;

  const gap = 180;
  const minPipeHeight = 80;
  const maxPipeHeight = gameArea.clientHeight - gap - minPipeHeight;
  const topPipeHeight = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;
  // used stackoverflow.com to learn this particular line to randomise the height of pipes  https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range/1527820#1527820
  const bottomPipeHeight = gameArea.clientHeight - topPipeHeight - gap;

  const topPipe = document.createElement("img");
  topPipe.src = "./FlappyBird/toppipe.png";
  topPipe.classList.add("upperpipe");
  topPipe.style.height = topPipeHeight + "px";
  topPipe.style.left = gameArea.clientWidth + "px";

  const bottomPipe = document.createElement("img");
  bottomPipe.src = "./FlappyBird/bottompipe.png";
  bottomPipe.classList.add("lowerpipe");
  bottomPipe.style.height = bottomPipeHeight + "px";
  bottomPipe.style.left = gameArea.clientWidth + "px";

  gameArea.appendChild(topPipe);
  gameArea.appendChild(bottomPipe);

  pipes.push({ top: topPipe, bottom: bottomPipe });
};
 
// Move pipes
const movePipes = () => {
  pipes.forEach((pipePair, index) => {
    const { top, bottom } = pipePair;
    const newLeft = top.offsetLeft - pipeSpeed;

    top.style.left = newLeft + "px";
    bottom.style.left = newLeft + "px";

    // remove off-screen pipes
    if (newLeft + top.offsetWidth < 0) {
      top.remove();
      bottom.remove();
      pipes.splice(index, 1); // i used mdn.com to learn splice
    }
  });
};

// // Collision check
// const checkCollision = () => {
//   const birdRect = birdEl.getBoundingClientRect();

//   pipes.forEach(({ top, bottom }) => {
//     const topRect = top.getBoundingClientRect();
//     const bottomRect = bottom.getBoundingClientRect();

//     if (
//       (birdRect.left < topRect.right &&
//         birdRect.right > topRect.left &&
//         birdRect.top < topRect.bottom) ||
//       (birdRect.left < bottomRect.right &&
//         birdRect.right > bottomRect.left &&
//         birdRect.bottom > bottomRect.top)
//     ) {
//       isGameOver = true;
//       console.log("Hit a pipe!");
//     }
//   });

//   if (birdY + birdEl.offsetHeight >= gameArea.clientHeight) {
//     isGameOver = true;
//     console.log("Hit the ground!");
//   }
// };

//ORRR
const checkCollision = () => {
  //Bird position and size
  const birdLeft = birdEl.offsetLeft;
  const birdTop = birdEl.offsetTop;
  const birdRight = birdEl + birbaction.offsetWidth;
  const birdBottom = birdEl + birbaction.offsetHeight;

  // Upper pipe position and size
  const upperLeft = upperpipe.offsetLeft;
  const upperTop = upperpipe.offsetTop;
  const upperRight = upperLeft + upperpipe.offsetWidth;
  const upperBottom = upperTop + upperpipe.offsetHeight;

   //Lower pipe position and size
  const lowerLeft = lowerpipe.offsetLeft;
  const lowerTop = lowerpipe.offsetTop;
  const lowerRight = lowerLeft + lowerpipe.offsetWidth;
  const lowerBottom = lowerTop + lowerpipe.offsetHeight;

  // Check collision with upper pipe
  const hitUpper =
    birdRight > upperLeft &&
    birdLeft < upperRight &&
    birdTop < upperBottom;

   //Check collision with lower pipe
  const hitLower =
    birdRight > lowerLeft &&
    birdLeft < lowerRight &&
    birdBottom > lowerTop;

  //If collision detected
  if (hitUpper || hitLower) {
    isGameOver = true;
    console.log("Collision detected!");
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
setInterval(generatePipes, 4000);
requestAnimationFrame(gameLoop);
