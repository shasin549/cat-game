// Get canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load images
const background = new Image();
background.src = "assets/henhouse.png";

const goalImg = new Image();
goalImg.src = "assets/goal.png";

const cat = { x: 50, y: 200, size: 40, speed: 4, img: new Image() };
cat.img.src = "assets/cat.png";

const ball = { x: 100, y: 200, size: 15, dx: 0, dy: 0, img: new Image() };
ball.img.src = "assets/football.png";

const hens = [
  { x: 400, y: 120, size: 35, dx: 2, dy: 2, img: new Image() },
  { x: 450, y: 250, size: 35, dx: -2, dy: 2, img: new Image() }
];
hens.forEach(h => h.img.src = "assets/hen.png");

// Goal area (inside hen house)
const goal = { x: 500, y: 150, width: 80, height: 100 };

// Track key presses
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Move the cat with arrow keys
function moveCat() {
  if (keys["ArrowUp"]) cat.y -= cat.speed;
  if (keys["ArrowDown"]) cat.y += cat.speed;
  if (keys["ArrowLeft"]) cat.x -= cat.speed;
  if (keys["ArrowRight"]) cat.x += cat.speed;

  // Stay inside canvas
  cat.x = Math.max(0, Math.min(canvas.width - cat.size, cat.x));
  cat.y = Math.max(0, Math.min(canvas.height - cat.size, cat.y));
}

// Move the ball with friction and bounce
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Friction
  ball.dx *= 0.98;
  ball.dy *= 0.98;

  // Bounce from walls
  if (ball.x < 0 || ball.x > canvas.width - ball.size) ball.dx *= -1;
  if (ball.y < 0 || ball.y > canvas.height - ball.size) ball.dy *= -1;

  // Check if goal is scored inside hen house
  if (ball.x + ball.size > goal.x &&
      ball.y > goal.y && ball.y < goal.y + goal.height) {
    alert("🎉 Goal inside the Hen House!");
    resetGame();
  }
}

// Move hens around to block ball
function moveHens() {
  hens.forEach(hen => {
    hen.x += hen.dx;
    hen.y += hen.dy;

    // Bounce hens inside restricted area
    if (hen.x < 350 || hen.x > canvas.width - hen.size) hen.dx *= -1;
    if (hen.y < 100 || hen.y > canvas.height - hen.size) hen.dy *= -1;
  });
}

// Detect collisions between cat, ball, and hens
function detectCollisions() {
  // Cat kicks the ball
  const distX = (cat.x + cat.size / 2) - (ball.x + ball.size / 2);
  const distY = (cat.y + cat.size / 2) - (ball.y + ball.size / 2);
  const distance = Math.sqrt(distX * distX + distY * distY);
  if (distance < cat.size / 2 + ball.size / 2) {
    ball.dx = distX * -0.2;
    ball.dy = distY * -0.2;
  }

  // Hens block the ball
  hens.forEach(hen => {
    const dx = (hen.x + hen.size / 2) - (ball.x + ball.size / 2);
    const dy = (hen.y + hen.size / 2) - (ball.y + ball.size / 2);
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < hen.size / 2 + ball.size / 2) {
      ball.dx *= -1;
      ball.dy *= -1;
    }
  });
}

// Reset game after goal
function resetGame() {
  ball.x = 100;
  ball.y = 200;
  ball.dx = 0;
  ball.dy = 0;
  cat.x = 50;
  cat.y = 200;
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background (hen house)
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Goal (inside hen house)
  ctx.drawImage(goalImg, goal.x, goal.y, goal.width, goal.height);

  // Cat
  ctx.drawImage(cat.img, cat.x, cat.y, cat.size, cat.size);

  // Ball
  ctx.drawImage(ball.img, ball.x, ball.y, ball.size * 2, ball.size * 2);

  // Hens
  hens.forEach(hen => {
    ctx.drawImage(hen.img, hen.x, hen.y, hen.size, hen.size);
  });
}

// Main game loop
function gameLoop() {
  moveCat();
  moveBall();
  moveHens();
  detectCollisions();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
