let canvas;
let canvasContext;

//ball variables
let ballX = 100;
let ballY = 100;
let ballSpeedX = 9;
let ballSpeedY = 6;

//paddle variables
let leftPaddleY;
let rightPaddleY = 30;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 8;

//Score variables
let winCondition = false;
let pointDone = false;
let scorePl1 = 0;
let scorePl2 = 0;
const W_SCORE = 3;

let startGame = true;


window.onload = function() {
    start();
}

function calculateMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return{
        x:mouseX,
        y:mouseY
    }
}

function start() {
    //Then, takes de canvas element
    canvas = document.getElementById("retroGames");
    canvasContext = canvas.getContext("2d");
    setTimeout(textLoaded,200); // only for loading the text on canvas
    let fps = 30;

    setInterval(function(){
        drawEverything();
        moveEverything();
    }, 1000 / fps);
    
    canvas.addEventListener("mousedown", restartGame);
    
    canvas.addEventListener("mousemove", 
        function(evt){
            let mousePos = calculateMousePos(evt);
            leftPaddleY = mousePos.y-(PADDLE_HEIGHT/2);
    });
}

function paddleBehaviour(){
    let rightPaddleYCenter = rightPaddleY+(PADDLE_HEIGHT/2);

    if(rightPaddleYCenter < ballY-15){
        rightPaddleY += getRandomFloat(7,9);
    }
    else if(rightPaddleYCenter > ballY+15){
        rightPaddleY -= getRandomFloat(7,9);
    }
}

function moveEverything(){
    if (winCondition){
        return;
    }

    paddleBehaviour();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    //Paddles colliders
    if (ballX <= PADDLE_THICKNESS){
        if(ballY > leftPaddleY && ballY <= leftPaddleY+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY-(leftPaddleY+ PADDLE_HEIGHT/2); //when the ball hits the paddle, the bouncing changes
            ballSpeedY = deltaY * 0.3;
        }
        else{
            scorePl2++;
            ballReset();
        }
    }

    if (ballX >= canvas.width-PADDLE_THICKNESS){
        if(ballY > rightPaddleY && ballY <= rightPaddleY+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY-(rightPaddleY + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.3;
        }
        else{
            scorePl1++;
            ballReset(); 
        }
    }

    //ball movement
    if(ballY < 0){
        ballSpeedY = -ballSpeedY;
    }
    if(ballY > canvas.height){
        ballSpeedY = -ballSpeedY;
    }
    
}

//////Reseting the Ball - Score - Game///////

function restartGame(evt){
    if(winCondition){
        scorePl1 = 0;
        scorePl2 = 0;
        winCondition = false;
    }
}

function initialScreenSetUp() {
    if (startGame) {
        colorText('Get Ready!', canvas.width/2,canvas.height/3, "white");
        colorText("the game will start soon", canvas.width/2,canvas.height-150, "white");
        startGame = false;
    }
}


function ballReset() {
    
    let ballSpeedReset = ballSpeedX;
    scenarioReset();
    ballSpeedX = -ballSpeedReset;
    ballX = canvas.width/2;
    ballY = canvas.height/2;

    if (scorePl2 >= W_SCORE || scorePl1 >= W_SCORE){
        winCondition = true;
    }
}

function scenarioReset(){
    let currentP1Score = 0;
    let currentP2Score = 0;
    if (scorePl1 > currentP1Score || scorePl2 > currentP2Score){
        if(ballX > canvas.width-PADDLE_THICKNESS){
            currentP1Score++;
        }
        else if (ballX < PADDLE_THICKNESS){
            currentP2Score++;
        }

        ballSpeedX = 0;
        ballSpeedY = 0;
        leftPaddleY = canvas.height/2;
        rightPaddleY = canvas.height/2;
        ballX = canvas.width/2;
        ballY = canvas.height/2;
        
        return;
    }
}


// Creating all the Visual Content


function drawEverything(){
    
    //background rectangle
    colorRect(0,0, canvas.width, canvas.height, "black");
    
    
    //Drawing the net
    for(let i=0; i<canvas.height; i+=26){
        colorRect(canvas.width/2-1,i, 3,13, 'blue');
    }

    //paddles: left / right
    colorRect(0, leftPaddleY, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
    colorRect(canvas.width, rightPaddleY, -PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

    //creating the ball
    colorCircle(ballX,ballY,5, "white");

    //Score////
    colorText(scorePl1, 100,100, "white");
    colorText(scorePl2, canvas.width-100,100, "white");

    gameOverScreen();
}


function gameOverScreen() {
    //Rendering the Game Over Screen
    if (winCondition){
        let winner = (scorePl1 > scorePl2)? "Human Player Won :)" : "computer won o_O";
        
        colorRect(0,0, canvas.width, canvas.height, "black");
        canvasContext.fillStyle = "white";
        canvasContext.fillText("Game Over", canvas.width/2, 100);
        canvasContext.fillText(winner, canvas.width/2, canvas.height/2);
        canvasContext.fillText("Clic to Play Again", canvas.width/2, canvas.height-100);
        return;
    }
}

//Small Functions
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function textLoaded() {
    canvasContext.font= "20px 'Press Start 2P'";
}