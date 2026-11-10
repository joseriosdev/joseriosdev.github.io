let canvas, canvasContext;

//ball variables
let ballX = 100;
let ballY = 100;
let ballSpeedX = 7;
let ballSpeedY = 7;

//paddle variables
let paddleX = 50;
const PADDLE_WIDTH = 100;
const CENTER_OF_PADDLE = PADDLE_WIDTH/2;
const PADDLE_THICKNESS = 15;
const PADDLE_DISTANCE_FROM_BOTTOM = 50;

//Tracks variables
const TRACK_COLUMS = 13;
const TRACK_ROWS = 6;
const TRACK_W = 60;
const TRACK_H = 30;
const TRACK_GAPS = 2;
let trackGrid = new Array(TRACK_COLUMS * TRACK_ROWS);
let remainingTracks = 0;


let winCondition = false;


let mouseX, mouseY;


function calculateMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    paddleX = mouseX-CENTER_OF_PADDLE
}

function trackReset(){
    remainingTracks = 0;
    let i;
    for (i=0;i<2*TRACK_COLUMS;i++){
        trackGrid[i] = false;
    }
    for(; i<TRACK_COLUMS* TRACK_ROWS; i++){
        
        trackGrid[i] = (getRandomFloat(0.1, 1.1) > 0.5) ? true: false;
        if (trackGrid[i]){
            remainingTracks++;
        }
    }
    
}

window.onload = function(){
    canvas = document.getElementById("retroGames");
    canvasContext = canvas.getContext("2d");
    let fps = 30;

    setInterval(function(){
        drawEverything();
        moveEverything();
    }, 1000 / fps);

    canvas.addEventListener("mousedown", restartGame);
    canvas.addEventListener("mousemove", calculateMousePos);

    trackReset();
}

function ballMove(){
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if(ballX < 0 && ballSpeedX < 0.0){
        ballSpeedX = -ballSpeedX;
    }
    if(ballX > canvas.width && ballSpeedX > 0.0){
        ballSpeedX = -ballSpeedX;
    }
    if(ballY < 0 && ballSpeedY < 0.0){
        ballSpeedY = -ballSpeedY;
    }
    if(ballY > canvas.height){
        ballReset();
        trackReset();
    }
}


function isTrackAtRowCol (col, row){
    if (col >= 0 && col < TRACK_COLUMS &&
        row >= 0 && row < TRACK_ROWS){
        let trackIndexUnderCoord = rowColToArrayIndex(col, row);
        return trackGrid[trackIndexUnderCoord];
    }else {
        return false;
    }

}


function ballTrackCollision(){
    let ballTrackCol =  Math.floor(ballX / TRACK_W);
    let ballTrackRow =  Math.floor(ballY / TRACK_H);
    let trackIndexUnderBall = rowColToArrayIndex(ballTrackCol, ballTrackRow);

    if (ballTrackCol >= 0 && ballTrackCol < TRACK_COLUMS &&
        ballTrackRow >= 0 && ballTrackRow < TRACK_ROWS){

        if (isTrackAtRowCol(ballTrackCol, ballTrackRow)) {
            trackGrid[trackIndexUnderBall] = false;
            remainingTracks--;

            let prevBallX = ballX - ballSpeedX;
            let prevBallY = ballY - ballSpeedY;
            let prevTrackCol = Math.floor(prevBallX / TRACK_W);
            let prevTrackRow = Math.floor(prevBallY / TRACK_H);

            let bothTestFailed = true;
            if (prevTrackCol != ballTrackCol){
                let adjTrackSide = rowColToArrayIndex(prevTrackCol, ballTrackRow);

                if(trackGrid[adjTrackSide] == false){
                    ballSpeedX *= -1;
                    bothTestFailed = false;
                }
            }
            if (prevTrackRow != ballTrackRow){
                let adjTrackSide = rowColToArrayIndex(prevTrackCol, prevTrackRow);

                if(trackGrid[adjTrackSide] == false){
                    ballSpeedY *= -1;
                    bothTestFailed = false;
                }
            }

            if(bothTestFailed){
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }
            
            
        } // end of track found
    }
}


function paddleCollider(){
    console.log(remainingTracks);

    let paddleTop = canvas.height-PADDLE_DISTANCE_FROM_BOTTOM;
    let paddleBottom = paddleTop+PADDLE_THICKNESS;
    let paddleLeft = paddleX;
    let paddleRight = paddleLeft+PADDLE_WIDTH;
    if( ballY>paddleTop && ballY<paddleBottom && ballX > paddleLeft && ballX < paddleRight){
            ballSpeedY *= -1;
            let ballBouncingChange = ballX-(paddleX+CENTER_OF_PADDLE);
            ballSpeedX = ballBouncingChange*0.35;  
            
            if (remainingTracks == 0){
                //winCondition = true;
                trackReset();
            }
    }
}


function moveEverything(){
    if (winCondition){
        return;
    }
    
    ballMove();
    ballTrackCollision();
    paddleCollider();    
}


//////Reseting the Ball - Score - Game///////

function restartGame(evt){
    if(winCondition){
        scorePl1 = 0;
        scorePl2 = 0;
        winCondition = false;
    }
}

function ballReset(){
    ballSpeedX = -ballSpeedX
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}



///////////////creating all the visual content////////////////


function drawEverything(){

    canvasContext.font = "14px Verdana";

    //background rectangle
    colorRect(0,0, canvas.width, canvas.height, "black");

    //Rendering the Game Over Screen
    /*if (winCondition){
        let winner = (scorePl1 > scorePl2)? " Nice human :) U have won " : " computer, u won ";
        canvasContext.fillStyle = "white";
        canvasContext.fillText("Game Over | " + winner, canvas.width/8, 30);
        canvasContext.fillText("Play Again", canvas.width/4, canvas.height-100);
        return;
    }*/

    

    //paddle
    colorRect(paddleX,canvas.height-PADDLE_DISTANCE_FROM_BOTTOM, PADDLE_WIDTH,PADDLE_THICKNESS, "blue");

    //creating the ball
    colorCircle(ballX,ballY,5, "white");

    //creating the trackGrid
    creatingTracks();

    //Score////
    //canvasContext.fillText(scorePl1, 25, 50);
    //canvasContext.fillText(scorePl2, canvas.width - 50, 50);
    let mouseTrackCol = Math.floor(mouseX / TRACK_W);
    let mouseTrackRow = Math.floor(mouseY / TRACK_H);
    let trackIndexUnderMouse = rowColToArrayIndex(mouseTrackCol, mouseTrackRow);
    //colorText(mouseTrackCol+","+mouseTrackRow+":"+trackIndexUnderMouse, mouseX,mouseY, "white");

}// END DRAW ALL


function creatingTracks(){
    for (let trackRow=0;trackRow<TRACK_ROWS;trackRow++){
        for (let trackCol=0;trackCol<TRACK_COLUMS;trackCol++){

            let arrayIndex = rowColToArrayIndex(trackCol,trackRow);

            if(trackGrid[arrayIndex]){
                colorRect(TRACK_W*trackCol,TRACK_H*trackRow, TRACK_W-TRACK_GAPS,TRACK_H-TRACK_GAPS, "red");
            }
        }
    }
}

///////////////////////////////////
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

function rowColToArrayIndex(col,row){
    return col + TRACK_COLUMS * row;
}
