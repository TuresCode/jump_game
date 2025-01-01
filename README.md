# Jump Game

    This is a simple jump game created using HTML, CSS, and JavaScript. The game features a character that jumps over obstacles, and the score is based on the time elapsed.

    ## How to Play

    1.  **Start Screen:**
        *   Enter your name in the "Player Name" input field.
        *   Tap or press the spacebar to start the game.
        *   The leaderboard displays the top 5 scores.
        *   Click the "Reset Leaderboard" button to clear the leaderboard.
    2.  **Game Screen:**
        *   Tap or press the spacebar to make the character jump.
        *   The score is displayed at the top right and increases with time.
        *   Avoid colliding with the obstacles.
    3.  **Game Over Screen:**
        *   The "Game Over" screen appears when the character collides with an obstacle.
        *   After a short delay, the game returns to the start screen.

    ## How to Execute

    1.  Make sure you have Node.js and npm installed.
    2.  Navigate to the project directory in your terminal.
    3.  Run `npm install` to install the dependencies.
    4.  Run `npm run dev` to start the development server.
    5.  Open your browser and go to the provided local server URL.

    ## Code Structure

    *   `index.html`: Contains the HTML structure of the game.
    *   `style.css`: Contains the CSS styles for the game.
    *   `script.js`: Contains the JavaScript logic for the game.
    *   `package.json`: Contains the project's dependencies and scripts.

    ## Game Logic

    *   The game uses `requestAnimationFrame` for smooth animations.
    *   The character jumps using a sine wave animation.
    *   Obstacles are spawned randomly and move across the screen.
    *   Collision detection is performed using bounding box checks.
    *   The score is calculated based on the time elapsed since the game started.
    *   The leaderboard is stored in the browser's local storage.

    ## Dependencies

    *   `vite`: Used for development server and bundling.

    ## Customization

    *   You can customize the game's appearance by modifying the `style.css` file.
    *   You can adjust the game's difficulty by changing the obstacle spawn interval and speed in the `script.js` file.
