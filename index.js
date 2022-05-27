/* Simple SnakeGame */

  /* get html contents */
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

  /* used classes */
    class SnakePart { // snake tail constructor
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
    }

  /* sleep function */
    function sleep(ms) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < ms);
    }

  /* game logic */

    /* variables */
      let speed = 10;

      let tileCount = 20; // size of the canvas in tile (20*20 = 400px)
      let tileSize = canvas.width / tileCount - 2; // size of the tile (snake head, snake tail, apple)

      // snake head positon and tail
      let headX = 10;
      let headY = 10;
      let tailLength = 2;
      const snakeParts = [];

      // apple positon
      let appleX = 5;
      let appleY = 5;

      let enemyX = 15;
      let enemyY = 15;

      // input
      let inputsXVelocity = 0;
      let inputsYVelocity = 0;

      // velocity
      let xVelocity = 0;
      let yVelocity = 0;

      let score = 0;

      let gameOver = false;
      let isInMenuScreen = true;

      const gulpSound = new Audio("sound.mp3");

    /* game loop and game functions */
    function drawGame() {

      // get the snake's current position
      xVelocity = inputsXVelocity;
      yVelocity = inputsYVelocity;

      changeSnakePosition();
      checkEnemyCollision();

      // check GameOver
      isGameOver();
      if (gameOver == true) {
        return; // recursive function return (end of the game)
      }

      // make everything on the canvas black
      clearScreen();
      drawEnemy();

      checkAppleCollision();

      drawApple();
      drawSnake();
      drawScore();

      increaseSnakeSpeed();

      setTimeout(drawGame, 1000 / speed); // overall game speed (fps)
    }

    function changeSnakePosition() {
      headX = headX + xVelocity;
      headY = headY + yVelocity;
    }

    function checkEnemyCollision() {
      if (enemyX === headX && enemyY === headY) {
        gameOver = true;
      }
    }

    function isGameOver() {

      if (yVelocity === 0 && xVelocity === 0) {
        return false;
      }

      // wall collision
      if (headX < 0) {
        gameOver = true;
      } else if (headX === tileCount) {
        gameOver = true;
      } else if (headY < 0) {
        gameOver = true;
      } else if (headY === tileCount) {
        gameOver = true;
      }

      // tail collision
      for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
          gameOver = true;
          break;
        }
      }

      if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", " magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        ctx.fillStyle = gradient; // fill with gradient

        ctx.fillText("Game Over!", canvas.width / 8, canvas.height / 2);

        ctx.font = "30px Verdana";
        ctx.fillText("Press enter to continue", canvas.width / 16, canvas.height / 1.6);
      }
    }

    function clearScreen() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height); // 0,0 = upper left corner of the canvas; canvas.width and canvas.height will fill the canvas
    }

    function drawEnemy() {
      ctx.fillStyle = "blue";
      ctx.fillRect(enemyX * tileCount, enemyY * tileCount, tileSize-1, tileSize-1); // appleX * tileCount, appleY * tileCount = x and y coordinate of the canvas
    }

    function checkAppleCollision() {
      if (appleX === headX && appleY === headY) { // randomly change apple location
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);

        while ((appleX === enemyX) && (appleY === enemyY)) { // check if the apple is where the enemy is
          appleX = Math.floor(Math.random() * tileCount);
          appleY = Math.floor(Math.random() * tileCount);
        }

        tailLength++; 
        score++;
        gulpSound.play();
      }
    }

    function drawApple() {
      ctx.beginPath(); // reset the current path
      ctx.fillStyle = "red";
      ctx.arc((appleX * tileCount) + 9, (appleY * tileCount) + 9, 10, 0, 2 * Math.PI); // (appleX * tileCount) + 9, (appleY * tileCount) + 9 = x and y coordinate of the canvas; 10 = size; and 0, 2 * Math.PI = radius of the circle
      ctx.fill(); // fills the current drawing (path)
    }

    function drawSnake() {
      ctx.fillStyle = "green";
      for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize); // part.x * tileCount, part.y * tileCount = x and y coordinate of the canvas
      }

      snakeParts.push(new SnakePart(headX, headY)); // put an item at the end of the list next to the head
      while (snakeParts.length > tailLength) {
        snakeParts.shift(); // remove the furthet item from the snake parts if have more than our tail size
      }

      ctx.fillStyle = "orange";
      ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize); // headX * tileCount, headY * tileCount = x and y coordinate of the canvas
    }

    function drawScore() {
      ctx.fillStyle = "white";
      ctx.font = "12px Verdana";
      ctx.fillText("Score " + score, canvas.width - 60, 20); // canvas.width - 50, 10 = fixed position on the canvas
    }

    function increaseSnakeSpeed() {
        if (score > 5) {
          speed = 12;
        }

        if (score > 10) {
          speed = 14;
        }

        if (score > 15) {
          speed = 18;
        }
    }

    /* menu screen */
      function menuScreen() {
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 0,0 = upper left corner of the canvas; canvas.width and canvas.height will fill the canvas

        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", " magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        ctx.fillStyle = gradient; // fill with gradient

        ctx.fillText("Snake Game", canvas.width / 10, canvas.height / 2);

        ctx.font = "30px Verdana";
        ctx.fillText("Press enter to start", canvas.width / 8, canvas.height / 1.6);
      }

    /* keyboard scan */
      document.body.addEventListener("keydown", keyDown);
        
      function keyDown(event) {

        if (event.key == "Enter" && isInMenuScreen == true) {
          isInMenuScreen = false;
          drawGame();
        }

        // up
        if (event.key == "ArrowUp" || event.key == "w") {
          if (inputsYVelocity == 1) return;
          inputsYVelocity = -1;
          inputsXVelocity = 0;
        }

        // down
        if (event.key == "ArrowDown" || event.key == "s") {
          if (inputsYVelocity == -1) return;
          inputsYVelocity = 1;
          inputsXVelocity = 0;
        }

        // left
        if (event.key == "ArrowLeft" || event.key == "a") {
          if (inputsXVelocity == 1) return;
          inputsYVelocity = 0;
          inputsXVelocity = -1;
        }

        // right
        if (event.key == "ArrowRight" || event.key == "d") {
          if (inputsXVelocity == -1) return;
          inputsYVelocity = 0;
          inputsXVelocity = 1;
        }

        // reset the game after the game over screen display
        if (event.key == "Enter" && gameOver == true) {
          resetGame();

          /* game loop and game functions */
          drawGame();
        }
      }

    /* reset variable values ​​to default */
    function resetGame() {
      speed = 10;

      headX = 10;
      headY = 10;
      tailLength = 2;
      snakeParts.splice(0,snakeParts.length);

      appleX = 5;
      appleY = 5;

      enemyX = Math.floor(Math.random() * tileCount);
      enemyY = Math.floor(Math.random() * tileCount);

      while (enemyX === headX && enemyY === headY) { // check if the enemy is where the snake head is
        enemyX = Math.floor(Math.random() * tileCount);
        enemyY = Math.floor(Math.random() * tileCount);
      }

      inputsXVelocity = 0;
      inputsYVelocity = 0;

      xVelocity = 0;
      yVelocity = 0;

      score = 0;

      gameOver = false;
    }
          
/* load game */
  menuScreen();
