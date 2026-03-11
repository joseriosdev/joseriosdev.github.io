const TRACK_W = 40;
const TRACK_H = 40;
const TRACK_GAP = 0;
const TRACK_COLS = 20;
const TRACK_ROWS = 15;
var theArena =  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				 1, 1, 1, 1, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1,
				 1, 1, 1, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1, 1, 1,
				 1, 1, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 3, 0, 1, 1,
				 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 1,
				 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1,
				 1, 0, 2, 2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1,
				 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 1, 1,
				 1, 1, 4, 4, 4, 1, 0, 0, 1, 1, 1, 0, 0, 3, 0, 0, 0, 0, 0, 1,
				 1, 0, 0, 0, 0, 1, 3, 0, 0, 0, 1, 3, 0, 1, 0, 0, 3, 0, 1, 1,
				 1, 0, 0, 0, 0, 1, 1, 0, 3, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 1,
				 1, 1, 0, 0, 0, 0, 3, 0, 1, 0, 1, 0, 0, 3, 0, 3, 3, 0, 1, 1,
				 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
				 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1,
				 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var slamZone =  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
				 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
				 1, 0, 3, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 3, 0, 1,
				 1, 0, 1, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1, 0, 1,
				 1, 0, 1, 3, 3, 1, 0, 1, 0, 3, 0, 3, 0, 1, 0, 3, 3, 1, 0, 1,
				 1, 0, 1, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1, 0, 1,
				 1, 0, 1, 3, 3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 3, 3, 1, 0, 1,
				 1, 2, 1, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1, 2, 1,
				 1, 1, 1, 1, 1, 0, 3, 1, 1, 1, 1, 1, 1, 3, 0, 1, 1, 1, 1, 1,
				 1, 0, 0, 0, 1, 0, 1, 3, 3, 3, 3, 3, 3, 1, 0, 1, 0, 0, 0, 1,
				 1, 0, 3, 0, 3, 0, 1, 3, 1, 4, 4, 1, 3, 1, 0, 3, 0, 3, 0, 1,
				 1, 0, 1, 0, 0, 0, 1, 3, 1, 0, 0, 1, 3, 1, 0, 0, 0, 1, 0, 1,
				 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1,
				 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
				 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var oldLevel =  [3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
				 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
				 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
				 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
				 1, 0, 0, 0, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 1,
				 1, 0, 0, 1, 1, 0, 0, 1, 3, 3, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 1, 3, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 2, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
				 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
				 1, 4, 0, 0, 0, 0, 1, 3, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
				 1, 4, 0, 0, 0, 0, 1, 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
				 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 3];


var crossCountry = 	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1,
					 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1,
					 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
					 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
					 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1,
					 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1,
					 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 3, 3, 1, 0, 0, 1,
					 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 3, 3, 1, 0, 0, 1,
					 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 0, 0, 1,
					 1, 0, 0, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 1, 0, 0, 1,
					 1, 0, 0, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 0, 0, 1,
					 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 0, 0, 1,
					 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1, 3, 3, 0, 0, 1,
					 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1, 3, 3, 2, 2, 1,
					 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];

var levelList = [theArena, slamZone, oldLevel, crossCountry];
var levelNow = 0;
var trackGrid = [];

const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYERSTART = 2;
const TRACK_TREE = 3;
const TRACK_GOAL = 4;

function returnTileTypeAtColRow(col, row) {
	if(col >= 0 && col < TRACK_COLS &&
		row >= 0 && row < TRACK_ROWS) {
		 var trackIndexUnderCoord = rowColToArrayIndex(col, row);
		 return trackGrid[trackIndexUnderCoord];
	} else {
		return TRACK_WALL;
	}
}

function carTrackHandling(whichCar) {
	var carTrackCol = Math.floor(whichCar.x / TRACK_W);
	var carTrackRow = Math.floor(whichCar.y / TRACK_H);
	var trackIndexUnderCar = rowColToArrayIndex(carTrackCol, carTrackRow);

	if(carTrackCol >= 0 && carTrackCol < TRACK_COLS &&
		carTrackRow >= 0 && carTrackRow < TRACK_ROWS) {
		var tileHere = returnTileTypeAtColRow( carTrackCol,carTrackRow );

		if(tileHere == TRACK_GOAL) {
			console.log(whichCar.name + " WINS!");
			nextLevel();
		} else if(tileHere != TRACK_ROAD && tileHere != TRACK_TREE) {
			// undoes the car movement which got it onto the wall
			whichCar.x -= Math.cos(whichCar.ang) * whichCar.speed;
			whichCar.y -= Math.sin(whichCar.ang) * whichCar.speed;

			whichCar.speed *= -0.5;
		} // end of track found
	} // end of valid col and row
} // end of carTrackHandling func

function rowColToArrayIndex(col, row) {
	return col + TRACK_COLS * row;
}

function drawTracks() {

	var arrayIndex = 0;
	var drawTileX = 0;
	var drawTileY = 0;
	for(var eachRow=0;eachRow<TRACK_ROWS;eachRow++) {
		for(var eachCol=0;eachCol<TRACK_COLS;eachCol++) {

			var arrayIndex = rowColToArrayIndex(eachCol, eachRow); 
			var tileKindHere = trackGrid[arrayIndex];
			var useImg = trackPics[tileKindHere];

			canvasContext.drawImage(useImg,drawTileX,drawTileY);
			drawTileX += TRACK_W;
			arrayIndex++;
		} // end of for each col
		drawTileY += TRACK_H;
		drawTileX = 0;
	} // end of for each row

} // end of drawTracks func