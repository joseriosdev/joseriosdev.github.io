let carPic = document.createElement('img');
let otherCarPic = document.createElement('img');
let trackPics = [];

let picsToLoad = 0; // set automatically based on imageList in loadImages()

function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	console.log(picsToLoad);
	if(picsToLoad == 0) {
		imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName) {
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = 'graphics/'+fileName;
}

function loadImageForTrackCode(trackCode, fileName) {
	trackPics[trackCode] = document.createElement('img');
	beginLoadingImage(trackPics[trackCode], fileName);
}

function loadImages() {
	let imageList = [
		{varName: carPic, theFile: 'redCar.png'},
		{varName: otherCarPic, theFile: 'blueCar.png'},

		{trackType: TRACK_ROAD, theFile: 'dirt.png'},
		{trackType: TRACK_WALL, theFile: 'wall.png'},
		{trackType: TRACK_GOAL, theFile: 'finishLine.png'},
		{trackType: TRACK_TREE, theFile: 'trees.png'}
		];

	picsToLoad = imageList.length;

	for(let i=0;i<imageList.length;i++) {
		if(imageList[i].varName != undefined) {
			beginLoadingImage(imageList[i].varName, imageList[i].theFile);
		} else {
			loadImageForTrackCode(imageList[i].trackType, imageList[i].theFile);
		}
	}
}