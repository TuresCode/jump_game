// DOM Elements
var startScreen = document.querySelector('.start-screen');
var gameContainer = document.querySelector('.game-container');
var gameOverScreen = document.querySelector('.game-over');
var playerNameInput = document.getElementById('playerName');
var character = document.querySelector('.character');
var scoreDisplay = document.getElementById('scoreValue');
var leaderboardDisplay = document.getElementById('leaderboard');
var resetButton = document.getElementById('resetButton');
var jumpText = document.querySelector('.jump-text');

// Game Variables
var isJumping = false;
var gameStarted = false;
var obstacles = [];
var initialSpawnInterval = 2000; // Initial obstacle spawn interval
var currentSpawnInterval = initialSpawnInterval;
var difficultyIncreaseInterval = 5000; // Time interval to increase difficulty
var lastDifficultyIncreaseTime = 0;
var isSpawning = false;
var score = 0;
var leaderboard = [];
var playerName = '';
var gameOverTimeout;
var startTime;
var scoreInterval;

// Load player name and leaderboard from localStorage
loadPlayerName();
loadLeaderboard();
updateLeaderboardDisplay();

// Event Listeners
playerNameInput.addEventListener('change', function (e) {
  playerName = e.target.value;
  localStorage.setItem('playerName', playerName);
});

resetButton.addEventListener('click', function () {
  resetLeaderboard();
});

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space' && !gameStarted && gameOverScreen.style.display === 'none') {
    startGame();
  }
  if (gameStarted && e.code === 'Space' && !isJumping) {
    jump();
  }
});

document.addEventListener('touchstart', function (e) {
  if (!gameStarted && gameOverScreen.style.display === 'none') {
    startGame();
  } else if (gameStarted && !isJumping) {
    jump();
  }
});

// Game Functions
function startGame() {
  if (!playerName) {
    playerName = playerNameInput.value || 'Player';
    localStorage.setItem('playerName', playerName);
  }
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';
  gameOverScreen.style.display = 'none';
  jumpText.style.display = 'block';
  gameStarted = true;
  obstacles = [];
  currentSpawnInterval = initialSpawnInterval;
  lastDifficultyIncreaseTime = Date.now();
  isSpawning = false;
  score = 0;
  startTime = Date.now();
  updateScoreDisplay();
  spawnObstacle();
  startScoreCounter();
  increaseDifficulty();
}

function startScoreCounter() {
  scoreInterval = setInterval(function () {
    if (gameStarted) {
      score = Math.floor((Date.now() - startTime) / 1000);
      updateScoreDisplay();
    }
  }, 100);
}

function jump() {
  if (isJumping) return;
  isJumping = true;
  var jumpHeight = 150;
  var duration = 500;
  var start = null;
  var initialBottom = 0;

  function animate(timestamp) {
    if (!start) start = timestamp;
    var progress = timestamp - start;
    var jumpProgress = Math.min(progress / duration, 1);
    var jumpValue = jumpHeight * Math.sin(jumpProgress * Math.PI);
    character.style.bottom = `${initialBottom + jumpValue}px`;

    if (progress < duration) {
      requestAnimationFrame(animate);
    } else {
      isJumping = false;
      character.style.bottom = `${initialBottom}px`;
    }
  }

  requestAnimationFrame(animate);
}

function spawnObstacle() {
  if (!gameStarted || isSpawning) return;
  isSpawning = true;

  var obstacleTypes = ['type1', 'type2', 'type3', 'type4'];
  var randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

  var obstacle = document.createElement('div');
  obstacle.classList.add('obstacle', randomType);
  gameContainer.appendChild(obstacle);
  obstacles.push(obstacle);

  var animationDuration = parseFloat(getComputedStyle(obstacle).animationDuration) * 1000;

  setTimeout(function () {
    obstacle.remove();
    obstacles = obstacles.filter(function (obs) {
      return obs !== obstacle;
    });
    isSpawning = false;
    spawnObstacle();
  }, animationDuration);
}

function checkCollision() {
  if (!gameStarted) return;

  var characterRect = character.getBoundingClientRect();

  for (var i = 0; i < obstacles.length; i++) {
    var obstacle = obstacles[i];
    var obstacleRect = obstacle.getBoundingClientRect();

    if (
      characterRect.right > obstacleRect.left &&
      characterRect.left < obstacleRect.right &&
      characterRect.bottom > obstacleRect.top
    ) {
      gameOver();
      return;
    }
  }
}

function increaseDifficulty() {
  if (!gameStarted) return;
  var now = Date.now();
  if (now - lastDifficultyIncreaseTime > difficultyIncreaseInterval) {
    currentSpawnInterval = Math.max(currentSpawnInterval * 0.8, 1000); // Increase difficulty
    lastDifficultyIncreaseTime = now;
  }
  setTimeout(increaseDifficulty, 1000);
}

function gameOver() {
  gameStarted = false;
  gameContainer.style.display = 'none';
  gameOverScreen.style.display = 'block';
  jumpText.style.display = 'none';
  obstacles.forEach(function (obstacle) {
    obstacle.remove();
  });
  obstacles = [];
  isSpawning = false;
  clearInterval(scoreInterval);
  updateLeaderboard();
  clearTimeout(gameOverTimeout);
  gameOverTimeout = setTimeout(function () {
    startScreen.style.display = 'flex';
    gameOverScreen.style.display = 'none';
  }, 2000);
}

function updateScoreDisplay() {
  scoreDisplay.textContent = score;
}

function loadPlayerName() {
  var storedPlayerName = localStorage.getItem('playerName');
  if (storedPlayerName) {
    playerName = storedPlayerName;
    playerNameInput.value = playerName;
  }
}

function loadLeaderboard() {
  var storedLeaderboard = localStorage.getItem('leaderboard');
  if (storedLeaderboard) {
    leaderboard = JSON.parse(storedLeaderboard);
  }
}

function updateLeaderboard() {
  leaderboard.push({ name: playerName, score: score });
  leaderboard.sort(function (a, b) {
    return b.score - a.score;
  });
  leaderboard = leaderboard.slice(0, 5); // Keep top 5 scores
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  updateLeaderboardDisplay();
}

function updateLeaderboardDisplay() {
  leaderboardDisplay.innerHTML = '';
  for (var i = 0; i < leaderboard.length; i++) {
    var listItem = document.createElement('li');
    listItem.textContent = leaderboard[i].name + ': ' + leaderboard[i].score;
    leaderboardDisplay.appendChild(listItem);
  }
}

function resetLeaderboard() {
  leaderboard = [];
  localStorage.removeItem('leaderboard');
  updateLeaderboardDisplay();
}

// Game Loop
setInterval(checkCollision, 10);