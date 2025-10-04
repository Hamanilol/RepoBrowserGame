const game = document.getElementById("game");
    const birb = document.getElementById("birb");
    const scoreDisplay = document.getElementById("score");

    let y = 200;
    let velocity = 0;
    const gravity = 0.5;
    const jump = -8;
    let score = 0;

    // Jump on spacebar
    window.addEventListener("keydown", e => {
      if (e.code === "Space") {
        velocity = jump;
      }
    });

    // Generate pipes
    const generatePipe = () => {
      const gap = 150;
      const minHeight = 50;
      const maxHeight = window.innerHeight - gap - minHeight;
      const upperHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
      const lowerHeight = window.innerHeight - upperHeight - gap;

      const pipeX = window.innerWidth;

      const upperPipe = document.createElement("div");
      upperPipe.classList.add("pipe", "upper");
      upperPipe.style.height = `${upperHeight}px`;
      upperPipe.style.left = `${pipeX}px`;

      const lowerPipe = document.createElement("div");
      lowerPipe.classList.add("pipe", "lower");
      lowerPipe.style.height = `${lowerHeight}px`;
      lowerPipe.style.left = `${pipeX}px`;

      game.appendChild(upperPipe);
      game.appendChild(lowerPipe);

      movePipe(upperPipe, lowerPipe);
    };

    // Move pipes
    const movePipe = (upperPipe, lowerPipe) => {
      let pipeX = window.innerWidth;
      let passed = false;

      const interval = setInterval(() => {
        pipeX -= 2;
        upperPipe.style.left = `${pipeX}px`;
        lowerPipe.style.left = `${pipeX}px`;

        // Collision check
        const birdRect = birb.getBoundingClientRect();
        const upperRect = upperPipe.getBoundingClientRect();
        const lowerRect = lowerPipe.getBoundingClientRect();

        if (
          (birdRect.left < upperRect.right &&
           birdRect.right > upperRect.left &&
           birdRect.top < upperRect.bottom) ||

          (birdRect.left < lowerRect.right &&
           birdRect.right > lowerRect.left &&
           birdRect.bottom > lowerRect.top)
        ) {
          alert("Game Over!");
          window.location.reload();
        }

        // Score update (only once per pipe pair)
        if (!passed && pipeX + upperPipe.offsetWidth < birb.offsetLeft) {
          passed = true;
          score++;
          scoreDisplay.textContent = score;
        }

        // Remove pipes when off-screen
        if (pipeX + upperPipe.offsetWidth < 0) {
          clearInterval(interval);
          upperPipe.remove();
          lowerPipe.remove();
        }
      }, 16);
    };

    // Gravity loop
    const gameLoop = () => {
      velocity += gravity;
      y += velocity;

      if (y < 0) y = 0;
      if (y + birb.offsetHeight > window.innerHeight) {
        alert("Game Over!");
        window.location.reload();
      }

      birb.style.top = `${y}px`;
      requestAnimationFrame(gameLoop);
    };

    // Start everything
    setInterval(generatePipe, 2000);
    gameLoop();