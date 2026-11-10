//SETTING UP SOME CONST
const G_EARTH = 9.8;
const PLANETS = [
	{name: 'mercury', gravity: 3.7},
	{name: 'venus', gravity: 8.87},
	{name: 'mars', gravity: 3.71},
	{name: 'jupiter', gravity: 24.79},
	{name: 'saturn', gravity: 10.44},
	{name: 'uranus', gravity: 8.87},
	{name: 'neptune', gravity: 11.15}
];
const PLANET_FORM = document.querySelector('.planet-form');
const USER_WEIGHT = document.getElementById('user-weight');
const PLANET_SELECTION = document.getElementById('planet-selection');

//There's only 1 evt listener for now
eventsBeenCalling();

function eventsBeenCalling(){
	PLANET_FORM.addEventListener('submit', weightGenerator);
}


//Here's the function for the only evt listener
function weightGenerator(evt){
	let choosenPlanet = PLANET_SELECTION.value;
	let uWeight = parseFloat(USER_WEIGHT.value);
	let finalResult;
	let resultDisplay = document.getElementById('weight-results');

	//clearing the last result here
	resultDisplay.innerHTML = '';

	//here's the core logic of the project
	PLANETS.forEach(function(planet){
		if(planet.name===choosenPlanet){
			finalResult = parseFloat((uWeight*planet.gravity/G_EARTH)).toFixed(2);
			return finalResult;
		}
	});

	//showing the result and end of the program
	resultDisplay.appendChild(document.createTextNode(`Your weight in ${choosenPlanet.toUpperCase()} is ${finalResult}kg.`));

	evt.preventDefault();
}


	