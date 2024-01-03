const board = document.getElementById("game-board");
const instructionText = document.getElementById("instructions");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highscore");
const selfCollision = document.getElementById('selfCollision');
const wallCollision = document.getElementById('wallCollision');
const gridSize = 20;

let snake = [{x:10, y:10}];
let foodPos = generateFoodPosition();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// to draw the map, snake and food
function draw(){
    board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore();
}

//drawing the snake
function drawSnake(){
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div','snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

//creating food or snake ele
function createGameElement(tag,theclassName){
    const element = document.createElement(tag);
    element.className = theclassName;
    return element;
}

//setting the coordinate of each snake segment
function setPosition(element, position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//drawing foof
function drawFood(){
    if (gameStarted){
        const foodElement = createGameElement('div','food');
        setPosition(foodElement, foodPos);
        board.appendChild(foodElement);
    }
}

//random food position generation
function generateFoodPosition(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x,y};
}

//moving the snake
function move(){
    const head = {...snake[0]};
    switch (direction){
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);
    // snake.pop();

    if (head.x === foodPos.x && head.y === foodPos.y){
        let audio = new Audio('food-eat.wav');
        audio.volume = 0.1;
        audio.play();
        foodPos = generateFoodPosition();
        increaseSpeed();
        clearInterval(gameInterval); //clearing past interval,, js inbuilt
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else{
        snake.pop();
    }
}

function startGame(){
    gameStarted = true; //keeping track of the game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

//test movement

// draw();
// setInterval(() => {
//     move();
//     draw();
// },200);

//Keypress event listener
function handleKeyPress(event){
    if ((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')){
        startGame();
    } else{
        switch (event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'Space':
                board.innerHTML = "";
                resetGame();
                break;
            case ' ':
                board.innerHTML = "";
                resetGame();
                break; 
        }
    }
}

document.addEventListener('keydown', handleKeyPress)

function increaseSpeed(){
    // console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
      } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
      } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
      } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
      }
}

function message(element){
    setTimeout(function() {
        element.style.display = 'block';
        setTimeout(function() {
            element.style.display = 'none';
        }, 3000); // Hide the message after 3 seconds
      }, 50);
}
function checkCollision(){
    const head = snake[0];

    //in event of collision with game wall
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        message(wallCollision);
        resetGame();
    }

    //in event of collision with self
    for (let i = 1; i < snake.length; i++){ //running the 'if' for every part of the snake
        if (head.x === snake[i].x && head.y === snake[i].y){
            message(selfCollision);
            resetGame();
        }
    }
}

function resetGame(){
    updateHightScore();
    stopGame();
    snake = [{x:10, y:10}];
    foodPos = generateFoodPosition();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore(); 
}

function updateScore(){
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHightScore(){
    const currentScore = snake.length - 1;
    if (currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display = 'block';
}