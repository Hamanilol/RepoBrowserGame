const birbaction = document.querySelector(".birbs");
const lowerpipes = document.querySelector(".lowerpipe")
let x = 100;
let y = 100;
const speed = 20;

const moveBirb = (event) => {
  const key = event.key;

  if (key === "ArrowUp") y -= speed;
  if (key === "ArrowDown") y += speed;
  if (key === "ArrowLeft") x -= speed;
  if (key === "ArrowRight") x += speed;


  birbaction.style.left = 100 + "px";
  birbaction.style.top = y + "px";

  console.log(`Birb moved to` + x + ":X" + y + ":Y");
  checkCollision()
};



const checkCollision = () => {
  //bird position relative to the css (since im using position: absoloute)
  const birdleft = x;
  const birdtop = y;
  const birdWidth = birbaction.offsetWidth;
  const birdHeight = birbaction.offsetHeight;
  //lowerpipe position relative to the css
  const lowerpipetop = lowerpipes.offsetTop
  const lowerpipeleft = lowerpipes.offsetLeft
  const lowerpipeWidth = lowerpipes.offsetWidth
  const lowerpipeHeight = lowerpipes.offsetHeight
  // an if statement to check if the bird has collided with the pipe
  if (
    birdleft < lowerpipeleft + lowerpipeWidth &&
    birdleft + birdWidth > lowerpipeleft &&
    birdtop < lowerpipetop + lowerpipeHeight &&
    birdtop + birdHeight > lowerpipetop
  ) {
    console.log("Collision detected!");
     document.removeEventListener("keydown", moveBirb); // stop movement
  }
};






document.addEventListener("keydown", moveBirb);
