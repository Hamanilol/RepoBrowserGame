// Grab elements
const birb = document.querySelector(".birbs")
const gameArea = document.getElementById("container")
const scoreFunc = document.getElementById("SCORE")
let score = 0
// Bird physics
let birdX = 30
let birdY = 10
let velocity = 2
const gravity = 0.1
const jumpStrength = -1.5

// Game state
let gameStarted = false
let isGameOver = false
let pipeSpeed = 2
const pipes = [] // active pipes
let interval = 1900
let pipeIntervalId;

// Jump
document.addEventListener("keydown", (controls) => {
  if (controls.code === "Space" || controls.code === "ArrowUp") {
    velocity = jumpStrength
  }
})

// create pipe elements whenever this function is called
const generatePipes = () => {
  // gap and pipe heights
  const gap = 150

  // minimum height of the top pipe
  const minPipeHeight = 80

  // maximum height of the top and bottom pipes
  const maxPipeHeight = gameArea.clientHeight - gap - minPipeHeight

  // random height for the top pipe between min and max height
  const topPipeHeight =
    Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight

  // i used stackoverflow.com to learn this particular line to demonstrate the random heights for the pipes in the range of max and minimum heights  https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range/1527820#1527820
  const bottomPipeHeight = gameArea.clientHeight - topPipeHeight - gap

  // I used mdn.com to learn createElement https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
  const topPipe = document.createElement("img")
  topPipe.src = "./FlappyBird/toppipe.png"
  topPipe.classList.add("upperpipe")
  topPipe.style.height = topPipeHeight + "px"
  topPipe.style.left = gameArea.clientWidth + "px"

  const bottomPipe = document.createElement("img")
  bottomPipe.src = "./FlappyBird/bottompipe.png"
  bottomPipe.classList.add("lowerpipe")
  bottomPipe.style.height = bottomPipeHeight + "px"
  bottomPipe.style.left = gameArea.clientWidth + "px"

  gameArea.appendChild(topPipe)
  gameArea.appendChild(bottomPipe)
  // used mdn.com to learn appendChild https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild and i followed the other link to find out that you can append multiple elements
  pipes.push({ top: topPipe, bottom: bottomPipe, passed: false })
}

const startPipeGen = () => {
  // it should basically replace the existing interval if one already exist

if (pipeIntervalId) {
    clearInterval(pipeIntervalId);
  }

//this would start a new interval
 pipeIntervalId = setInterval(generatePipes, interval);
}

// Move pipes
const movePipes = () => {
  pipes.forEach((pipePair, index) => {
    const { top, bottom } = pipePair
    const newLeft = top.offsetLeft - pipeSpeed

    top.style.left = newLeft + "px"
    bottom.style.left = newLeft + "px"

    // remove off-screen pipes
    if (newLeft + top.offsetWidth < 0) {
      top.remove()
      bottom.remove()
      pipes.splice(index, 1)
    }
  })
}

// Collision check
const checkCollision = () => {
  const birdRect = birb.getBoundingClientRect()

  pipes.forEach(({ top, bottom }) => {
    const topRect = top.getBoundingClientRect()
    const bottomRect = bottom.getBoundingClientRect()

    if (
      (birdRect.left < topRect.right &&
        birdRect.right > topRect.left &&
        birdRect.top < topRect.bottom) ||
      (birdRect.left < bottomRect.right &&
        birdRect.right > bottomRect.left &&
        birdRect.bottom > bottomRect.top)
    ) {
      isGameOver = true
      console.log("Hit a pipe!")
      gameover()
    }
  })
  // Check if bird hits the ground
  if (birdY + birb.offsetHeight >= gameArea.clientHeight) {
    isGameOver = true
    console.log("Hit the ground!")
    gameover()
  }
  // hits the ceiling
  if (birdY <= 0) {
    isGameOver = true
    console.log("Hit the ceiling!")
    gameover()
  }

}

// Main loop
const gameLoop = () => {
  if (!isGameOver) {
    velocity += gravity
    birdY += velocity
    // set bird position using style relative to game area
    birb.style.top = birdY + "vh"
    birb.style.left = birdX + "vw"

    checkCollision()
    movePipes()
    updateScore()
    requestAnimationFrame(gameLoop)
  } else {
    console.log("Game Over!")
  }
}

// Setup score display
const setupScoreDisplay = () => {
  scoreFunc.innerText = "Score: " + score
  scoreFunc.style.color = "white"
  scoreFunc.style.fontFamily = "Press Start 2P"
  scoreFunc.style.position = "absolute"
  scoreFunc.style.top = "20px"
  scoreFunc.style.left = "20px"
  scoreFunc.style.fontSize = "20px"
}

// Update score whenever the bird passes a pipe
const updateScore = () => {
  pipes.forEach((pipePair) => {
    const { top } = pipePair
    const pipeRight = top.offsetLeft + top.offsetWidth

    if (!pipePair.passed && pipeRight < birdX * (window.innerWidth / 100)) {
      score++
      pipePair.passed = true
      scoreFunc.textContent = "Score: " + score
    }
    if (score != 0 && score % 5 === 0 ) {
      console.log("score")
      pipeSpeed += 0.02
      startPipeGen()
    }
  })

}
const gameover = () => {
    isGameOver = true
    //shows the game over screen
    document.getElementById("gameOverScreen").classList.remove("hidden")

    // basically to stop any pipe generation
    clearInterval(pipeIntervalId)


}
//event listener for reloading the page using the space button
  document.addEventListener("keydown", (event) => {
    if(isGameOver &&(event.code ==="Space")) {
      window.location.reload()
    }
  })


setupScoreDisplay()
startPipeGen()
requestAnimationFrame(gameLoop)
