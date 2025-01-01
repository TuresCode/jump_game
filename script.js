var startScreen = document.querySelector('.start-screen');
    var gameContainer = document.querySelector('.game-container');
    var gameOverScreen = document.querySelector('.game-over');
    var playerNameInput = document.getElementById('playerName');
    var character = document.querySelector('.character');
    var scoreDisplay = document.getElementById('scoreValue');
    var leaderboardDisplay = document.getElementById('leaderboard');
    var resetButton = document.getElementById('resetButton');
    var jumpText = document.querySelector('.jump-text');
    var isJumping = false;
    var gameStarted = false;
    var obstacles = [];
    var initialSpawnInterval = 5000;
    var currentSpawnInterval = initialSpawnInterval;
    var difficultyIncreaseInterval = 5000;
    var lastDifficultyIncreaseTime = 0;
    var isSpawning = false;
    var score = 0;
    var leaderboard = [];
    var playerName = '';
    var gameOverTimeout;
    var startTime;
    var scoreInterval;

    loadPlayerName();
    loadLeaderboard();
    updateLeaderboardDisplay();

    playerNameInput.addEventListener('change', function(e) {
      playerName = e.target.value;
      localStorage.setItem('playerName', playerName);
    });

    resetButton.addEventListener('click', function() {
      resetLeaderboard();
    });

    document.addEventListener('keydown', function(e) {
      if (e.code === 'Space' && !gameStarted && gameOverScreen.style.display === 'none') {
        startGame();
      }
      if (gameStarted && e.code === 'Space' && !isJumping) {
        jump();
      }
    });

    gameContainer.addEventListener('touchstart', function(e) {
      if (!gameStarted && gameOverScreen.style.display === 'none') {
        startGame();
      }
      if (gameStarted && !isJumping) {
        jump();
      }
    });

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
    }

    function startScoreCounter() {
      scoreInterval = setInterval(function() {
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
      var currentBottom = initialBottom;

      function animate(timestamp) {
        if (!start) start = timestamp;
        var progress = timestamp - start;
        var jumpProgress = Math.min(progress / duration, 1);
        var jumpValue = jumpHeight * Math.sin(jumpProgress * Math.PI);
        character.style.bottom = `${currentBottom + jumpValue}px`;

        if (progress < duration) {
          requestAnimationFrame(animate);
        } else {
          isJumping = false;
          currentBottom = initialBottom;
          character.style.bottom = `${currentBottom}px`;
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

      setTimeout(function() {
        obstacle.remove();
        obstacles = obstacles.filter(function(obs) { return obs !== obstacle; });
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
        currentSpawnInterval = Math.max(currentSpawnInterval * 0.8, 3000);
        lastDifficultyIncreaseTime = now;
      }
      setTimeout(increaseDifficulty, 1000);
    }

    function gameOver() {
      gameStarted = false;
      gameContainer.style.display = 'none';
      gameOverScreen.style.display = 'block';
      jumpText.style.display = 'none';
      obstacles.forEach(function(obstacle) { obstacle.remove(); });
      obstacles = [];
      isSpawning = false;
      clearInterval(scoreInterval);
      updateLeaderboard();
      clearTimeout(gameOverTimeout);
      gameOverTimeout = setTimeout(function() {
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
      leaderboard.sort(function(a, b) { return b.score - a.score; });
      leaderboard = leaderboard.slice(0, 5);
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

    setInterval(checkCollision, 10);
    increaseDifficulty();
