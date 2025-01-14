const dino = document.getElementById("dino");
const gameContainer = document.querySelector(".game-container");
const scoreElement = document.getElementById("score");

let isJumping = false;
let gameOver = false;
let gravity = 5; // Dino's fall speed
let jumpHeight = 100; // Shorter jump height
let score = 0;
let cactusSpeed = 10; // Initial cactus speed
let speedIncrementRate = 0.5; // Rate at which cactus speed increases

// Handle Dino Jump
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && !isJumping) {
    isJumping = true;
    let currentHeight = 0;

    // Dino jumps upward
    const jumpInterval = setInterval(() => {
      if (currentHeight < jumpHeight) {
        currentHeight += 8; // Speed of the upward movement
        dino.style.bottom = 100 + currentHeight + "px";
      } else {
        clearInterval(jumpInterval);

        // Dino falls back down
        const fallInterval = setInterval(() => {
          if (currentHeight > 0) {
            currentHeight -= gravity;
            dino.style.bottom = 100 + currentHeight + "px";
          } else {
            clearInterval(fallInterval);
            isJumping = false;
          }
        }, 20);
      }
    }, 20);
  }
});

// Add a new cactus to the screen
const addCactus = () => {
  if (gameOver) return;

  const cactus = document.createElement("div");
  cactus.classList.add("cactus");
  cactus.style.left = "100%";
  gameContainer.appendChild(cactus);

  const cactusInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(cactusInterval);
      cactus.remove();
      return;
    }

    const cactusPosition = parseInt(getComputedStyle(cactus).left);
    const dinoPosition = dino.getBoundingClientRect();
    const cactusPositionRect = cactus.getBoundingClientRect();

    // Move cactus to the left
    cactus.style.left = cactusPosition - cactusSpeed + "px";

    // Check for collision (using getBoundingClientRect for more precise checks)
    if (
      cactusPositionRect.right > dinoPosition.left &&
      cactusPositionRect.left < dinoPosition.right &&
      cactusPositionRect.bottom > dinoPosition.top &&
      cactusPositionRect.top < dinoPosition.bottom
    ) {
      alert("Game Over! Final Score: " + score);
      gameOver = true;
      clearInterval(cactusInterval);
      return;
    }

    // Remove cactus if it moves off-screen
    if (cactusPosition < -50) {
      cactus.remove();
    }
  }, 20);

  // Add a new cactus after a random delay
  const delay = Math.random() * 1500 + 800;
  setTimeout(addCactus, delay);
};

// Update the score and speed over time
const updateGame = () => {
  if (gameOver) return;

  // Increase score
  score += 1; // Increment score every frame
  scoreElement.innerText = "Score: " + score;

  // Increase speed over time
  cactusSpeed += speedIncrementRate / 100;

  requestAnimationFrame(updateGame); // Continue updating the game
};

addCactus();
updateGame();
