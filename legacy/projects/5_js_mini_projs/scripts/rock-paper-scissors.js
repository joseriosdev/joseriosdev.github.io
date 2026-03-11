const HAND_OPTIONS = {
	1: {
		txt: 'rock',
		symb:  '&#9994;'
	},
	2: {
		txt: 'paper',
		symb:  '&#9995;'
	},
	3: {
		txt: 'scissors',
		symb:  '&#9996'
	}
};
const USER_WINS = [
	'The nice looking user has won',
	'Superb player won',
	'The GREAT person playing won :3',
	'Wow! You won',
	'You\'re the winner'
];
const PC_WINS = [
	'The machine WON',
	'The laptop has won',
	'The \'AI\' lml won',
	'The computer won :D',
	'The PC won :)',
];

let gameTextPanel = document.getElementById("pc-display");


function startGame(){
	const USER_PICK = document.querySelector('.input-form input[name="u-pick"]:checked');
	const PC_PICK = HAND_OPTIONS[getRandom(1,3)];
	gameLogic(USER_PICK, PC_PICK)
}

function gameLogic(userPick, pcPick){
	//Check if player didn't pick anything
	if(userPick === null){
		gameTextPanel.innerHTML = "Why don't you play it?";
	}

	//Core logic here
	else if(userPick.value === pcPick.txt){
		gameTextPanel.innerHTML = `Was ${pcPick.txt} ${pcPick.symb}<br><br>So it's a draw`;
	}
	else if 
		(userPick.value === 'rock' && pcPick.txt === 'scissors' || 
		userPick.value === 'paper' && pcPick.txt === 'rock' || 
		userPick.value === 'scissors' && pcPick.txt === 'paper'){
		gameTextPanel.innerHTML = `Was ${pcPick.txt} ${pcPick.symb}<br><br>${USER_WINS[getRandom(0, USER_WINS.length-1)]}`;
	}
	else {
		gameTextPanel.innerHTML = `Was ${pcPick.txt} ${pcPick.symb}<br><br>${PC_WINS[getRandom(0, PC_WINS.length-1)]}`;
	}
}

function getRandom(min, max){
	return Math.floor(Math.random() * (max-min+1)+min);
}