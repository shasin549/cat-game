const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Cat, Ball, Hens, Goal setup
const cat = { x: 50, y: 200, size: 40, speed: 4, img: new Image() };
cat.img.src = "assets/cat.png";

const ball = { x: 100, y: 200, size: 15, dx: 0, dy: 0, img: new Image() };
ball.img.src = "assets/football.png";

const hens = [
  { x: 300, y: 100, size: 35, dx: 2, dy: 2, img: new Image() },
  { x: 400, y: 300, size: 35, dx: -2, dy: 2, img: new Image() }
];
hens.forEach(h => h.img.src = "assets/hen.png");

const goal = { x: 550, y: 150, width: 30, height: 100 };

let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function moveCat() {
  if (keys["ArrowUp"]) cat.y -= cat.speed;
  if (keys["ArrowDown"]) cat.y += cat.speed;
  if (keys["ArrowLeft"]) cat.x -= cat.speed;
  if (keys["ArrowRight"]) cat.x += cat.speed;

  cat.x = Math.max(0, Math.min(canvas.width - cat.size, cat.x));
  cat.y = Math.max(0, Math.min(canvas.height - cat.size, cat.y));
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  ball.dx *= 0.98;
  ball.dy *= 0.98;

  if (ball.x < 0 || ball.x > canvas.width - ball.size) ball.dx *= -1;
  if (ball.y < 0 || ball.y > canvas.height - ball.size) ball.dy *= -1;

  if (ball.x + ball.size > goal.x &&
      ball.y > goal.y && ball.y < goal.y + goal.height) {
    alert("🎉 Goal! The Cat Wins!");
    resetGame();
  }
}

function moveHens() {
  hens.forEach(hen => {
    hen.x += hen.dx;
    hen.y += hen.dy;
    if (hen.x < 0 || hen.x > canvas.width - hen.size) hen.dx *= -1;
    if (hen.y < 0 || hen.y > canvas.height - hen.size) hen.dy *= -1;
  });
}

function detectCollisions() {
  const distX = (cat.x + cat.size/2) - (ball.x + ball.size/2);
  const distY = (cat.y + cat.size/2) - (ball.y + ball.size/2);
  const distance = Math.sqrt(distX*distX + distY*distY);
  if (distance < cat.size/2 + ball.size/2) {
    ball.dx = distX * -0.2;
    ball.dy = distY * -0.2;
  }

  hens.forEach(hen => {
    const dx = (hen.x + hen.size/2) - (ball.x + ball.size/2);
    const dy = (hen.y + hen.size/2) - (ball.y + ball.size/2);
    const d = Math.sqrt(dx*dx + dy*dy);
    if (d < hen.size/2 + ball.size/2) {
      ball.dx *= -1;
      ball.dy *= -1;
    }
  });
}

function resetGame() {
  ball.x = 100; ball.y = 200;
  ball.dx = 0; ball.dy = 0;
  cat.x = 50; cat.y = 200;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "green";
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

  ctx.drawImage(cat.img, cat.x, cat.y, cat.size, cat.size);
  ctx.drawImage(ball.img, ball.x, ball.y, ball.size*2, ball.size*2);

  hens.forEach(hen => {
    ctx.drawImage(hen.img, hen.x, hen.y, hen.size, hen.size);
  });
}

function gameLoop() {
  moveCat();
  moveBall();
  moveHens();
  detectCollisions();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
