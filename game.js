// Play background music
var bgMusic = document.getElementById("bg-music");
bgMusic.play();

// Get the mute button element
var muteButton = document.getElementById("muteButton");    

// Mute flag
var isMuted = false;

// Handle mute button click
muteButton.addEventListener("click", function() {
  if (isMuted) {
    // Unmute the audio
    bgMusic.muted = false;
    muteButton.textContent = "Mute";
  } else {
    // Mute the audio
    bgMusic.muted = true;
    muteButton.textContent = "Unmute";
  }
  
  // Toggle the mute flag
  isMuted = !isMuted;
});

// Retry counter
var retryCount = 0;

// Game screen dimensions
var screen_width = 800;
var screen_height = 600;

// Player dimensions
var player_width = 50;
var player_height = 50;

// Bus dimensions
var bus_width = 100;
var bus_height = 100;

// Obstacle dimensions
var obstacle_width = 50;
var obstacle_height = 50;

// Player movement speed
var player_speed = 5;

// Bus speed
var bus_speed = 3;

// Obstacle speed
var obstacle_speed = 7;

// Create the game canvas
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Load images
var backgroundImage = new Image();
backgroundImage.src = "background.png";
var player_img = new Image();
player_img.src = "player.png";
var bus_img = new Image();
bus_img.src = "bus.png";
var obstacle_img = new Image();
obstacle_img.src = "obstacle.png";

// Player position
var player_x = 50;
var player_y = screen_height / 2 - player_height / 2;

// Bus position
var bus_x = screen_width / 2 - bus_width / 2;
var bus_y = screen_height / 2 - bus_height / 2;

// Obstacles
var obstacles = [];

// Game over flag
var game_over = false;

// Retry button
var retryButton = document.getElementById("retryButton");

// Handle retry button click
retryButton.addEventListener("click", function() {
  resetGame();
});

// Function to reset the game
function resetGame() {
  player_x = 50;
  player_y = screen_height / 2 - player_height / 2;
  obstacles = [];
  game_over = false;
  retryButton.style.display = "none";
  retryCount++; // Increment retry count
  requestAnimationFrame(gameLoop);
}

// Function to draw objects on the canvas
function drawObjects() {
  ctx.clearRect(0, 0, screen_width, screen_height);
  ctx.drawImage(player_img, player_x, player_y, player_width, player_height);
  ctx.drawImage(bus_img, bus_x, bus_y, bus_width, bus_height);
  obstacles.forEach(function(obstacle) {
    ctx.drawImage(obstacle_img, obstacle.x, obstacle.y, obstacle_width, obstacle_height);
  });
}

// Function to check collision between two rectangles
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

// Game loop
function gameLoop() {
  if (game_over) {
    retryButton.style.display = "block";
    return;
  }

  // Move player closer to the bus
  if (player_x < bus_x - player_width) {
    player_x += 1;
  }

// Move player
if (keys["ArrowUp"] || touch === "up") {
  if (player_y > 0) { // Check if player is at the top boundary
    player_y -= player_speed;
  }
}
if (keys["ArrowDown"] || touch === "down") {
  if (player_y < screen_height - player_height) { // Check if player is at the bottom boundary
    player_y += player_speed;
  }
}

  // Move bus
  if (bus_x < screen_width - bus_width - bus_speed) {
    bus_x += bus_speed;
  } else {
    bus_x = screen_width - bus_width; // Stop the bus at the edge
  }

  // Move obstacles
  obstacles.forEach(function(obstacle) {
    obstacle.x -= obstacle_speed;
  });

  // Check collision with bus
  if (player_x >= bus_x - player_width && player_x <= bus_x + bus_width) {
    game_over = true;
    retryButton.style.display = "block";
    console.log("You caught up with the bus! Congratulations, you win!");
    return;
  }

  // Check collision with obstacles
  obstacles.forEach(function(obstacle) {
    if (
      checkCollision(
        {
          x: player_x,
          y: player_y,
          width: player_width,
          height: player_height,
        },
        {
          x: obstacle.x,
          y: obstacle.y,
          width: obstacle_width,
          height: obstacle_height,
        }
      )
    ) {
      game_over = true;
      retryButton.style.display = "block";
      console.log("You collided with an obstacle! Game over!");
      return;
    }
  });

  // Add new obstacles
  if (obstacles.length < 10 && Math.random() < 0.1) {
    var obstacle_x = screen_width + obstacle_width;
    var obstacle_y = Math.random() * (screen_height - obstacle_height);
    obstacles.push({ x: obstacle_x, y: obstacle_y });
  }

  // Remove off-screen obstacles
  obstacles = obstacles.filter(function(obstacle) {
    return obstacle.x > -obstacle_width;
  });

  // Draw objects
  drawObjects();
  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Retry Count: " + retryCount, 10, 30);

  requestAnimationFrame(gameLoop);
}

// Keyboard input handling
var keys = {};

document.addEventListener("keydown", function(event) {
  keys[event.key] = true;

  // Prevent scrolling when arrow keys are pressed
  if (event.key.startsWith("Arrow")) {
    event.preventDefault();
  }
});

document.addEventListener("keyup", function(event) {
  keys[event.key] = false;
});

// Touch input handling
var touch = null;
var touchUpButton = document.getElementById("touch-up");
var touchDownButton = document.getElementById("touch-down");

touchUpButton.addEventListener("touchstart", function(event) {
  event.preventDefault();
  touch = "up";
});

touchDownButton.addEventListener("touchstart", function(event) {
  event.preventDefault();
  touch = "down";
});

touchUpButton.addEventListener("touchend", function(event) {
  event.preventDefault();
  touch = null;
});

touchDownButton.addEventListener("touchend", function(event) {
  event.preventDefault();
  touch = null;
});

// Start the game
resetGame();

// Check if the device is mobile
function isMobileDevice() {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  );
}

// Show/hide touch controls based on device type
function toggleTouchControls() {
  var touchControls = document.getElementById("touch-controls");
  touchControls.style.display = isMobileDevice() ? "block" : "none";
}

// Call the toggleTouchControls function initially to set the initial display of touch controls
toggleTouchControls();
