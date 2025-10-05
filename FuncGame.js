// Grab elements
const birb = document.querySelector(".birbs");
const gameArea = document.getElementById("container");

// Bird physics
let birdX = 100;
let birdY = 500;
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
  // Create pipe elements whenever this function is called
const generatePipes = () => {
  if (isGameOver) return;

// Gap and pipe heights
  const gap = 180;

  // minimum height of the top pipe
  const minPipeHeight = 80;

  // maximum height of the top pipe
  const maxPipeHeight = gameArea.clientHeight - gap - minPipeHeight;

  // random height for the top pipe between min and max height
  const topPipeHeight = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;

  // i used stackoverflow.com to learn this particular line to demonstrate the random heights for the pipes in the range of max and minimum heights  https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range/1527820#1527820
  const bottomPipeHeight = gameArea.clientHeight - topPipeHeight - gap;



  // I used mdn.com to learn createElement https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
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
// used mdn.com to learn appendChild https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild and i followed the other link to find out that you can append multiple elements
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
      pipes.splice(index, 1); // i used mdn.com to learn splice and push https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice push https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
    }
  });
};
const endGame = () => {
  if (isGameOver) return;
  isGameOver = true;
  gameLostText();
};
// Collision check
const checkCollision = () => {
  const birdRect = birb.getBoundingClientRect();

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
// Check if bird hits the ground
  if (birdY + birb.offsetHeight >= gameArea.clientHeight) {
    isGameOver = true;
    console.log("Hit the ground!");
  }
  // hits the ceiling
  if (birdY <= 0) {
    isGameOver = true;
    console.log("Hit the ceiling!");
  }
};

//ORRR
// const checkCollision = () => {
//   //Bird position and size
//   const birdLeft = birdEl.offsetLeft;
//   const birdTop = birdEl.offsetTop;
//   const birdRight = birdLeft + birdEl.offsetWidth;
//   const birdBottom = birdTop + birdEl.offsetHeight;

//   // Pipe positions and sizes (assuming only one pair of pipes for simplicity)

//   const upperLeft = topPipe.offsetLeft;
//   const upperTop = topPipe.offsetTop;
//   const upperRight = upperLeft + topPipe.offsetWidth;
//   const upperBottom = upperTop + topPipe.offsetHeight;

//   const lowerLeft = bottomPipe.offsetLeft;
//   const lowerTop = bottomPipe.offsetTop;
//   const lowerRight = lowerLeft + bottomPipe.offsetWidth;
//   const lowerBottom = lowerTop + bottomPipe.offsetHeight;


//   const hitUpper =
//     birdRight > upperLeft &&
//     birdLeft < upperRight &&
//     birdTop < upperBottom;


//   const hitLower =
//     birdRight > lowerLeft &&
//     birdLeft < lowerRight &&
//     birdBottom > lowerTop;


//   if (hitUpper || hitLower) {
//     isGameOver = true;
//     console.log("Collision detected!");
//   }
// };

// Main loop
const gameLoop = () => {
  if (!isGameOver) {
    velocity += gravity;
    birdY += velocity;
    // set bird position using style relative to game area
    birb.style.top = birdY + "px";
    birb.style.left = birdX + "px";

    checkCollision();
    movePipes();

    requestAnimationFrame(gameLoop);
  } else {  
    console.log("Game Over!");
  }
};

// inner text function when you lose the game
const gameLostText = () => {
  const gameLost = document.getElementById("gamelost");
  if (isGameOver) {
    gameLost.innerText = "Game Over! Refresh to play again.";
  }
};


setInterval(generatePipes, 3000);
requestAnimationFrame(gameLoop);
