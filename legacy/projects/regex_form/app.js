// the password input had several functions to work
// all other inputs works with RegExp only :)
const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const phoneField = document.getElementById("phone");
const passwordField = document.getElementById("password");
const zipcodeField = document.getElementById("zipcode");
const passwordBtnGenerator = document.getElementById("pass-btn-gen");

// Literal object for _passwordChecker_ and _passwordGenerator_ functions
const passwordChars = {
  numbers : ["0","1","2","3","4","5","6","7","8","9"],
  specialChars : ["#",".","!","*","+","-","@"," ","?","&","%","$"],
  lowLetters : [
    "a","b","c","d","e","f","g","h","i","j","k","l","m",
    "n","o","p","q","r","s","t","u","v","w","x","y","z"
  ],
  capLetters : [
    "A","B","C","D","E","F","G","H","I","J","K","L","M",
    "N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
  ]
};

nameField.addEventListener("blur", (evt) => {
  let regex = /^[a-zA-Z ]{2,20}$/;
  
  if(regex.test(evt.target.value)) {
    nameField.classList.remove("is-invalid");
  } else {
    nameField.classList.add("is-invalid");
  }
});

emailField.addEventListener("blur", (evt) => {
  let regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,7})$/;
  
  if(regex.test(evt.target.value)) {
    emailField.classList.remove("is-invalid");
  } else {
    emailField.classList.add("is-invalid");
  }
});

phoneField.addEventListener("blur", (evt) => {
  let regex = /^(\+? ?\d{1,2}?[-. ]?\d{1,3}?[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;

  if(regex.test(evt.target.value)) {
    phoneField.classList.remove("is-invalid");
  } else {
    phoneField.classList.add("is-invalid");
  }
});

passwordField.addEventListener("blur", (evt) => {
  if(passwordChecker(evt.target.value)) {
    passwordField.classList.remove("is-invalid");
  } else {
    passwordField.classList.add("is-invalid");
  }
});

zipcodeField.addEventListener("blur", (evt) => {
  let regex = /^[0-9]{5}[ -]?([0-9]{4})?$/;

  if(regex.test(evt.target.value)) {
    zipcodeField.classList.remove("is-invalid");
  } else {
    zipcodeField.classList.add("is-invalid");
  }
});

passwordBtnGenerator.addEventListener("click", (evt) => {
  evt.target.parentElement.previousElementSibling.value = passwordGenerator();
});

function passwordToggle() {
  if (passwordField.type === "password") {
    passwordField.type = "text";
  } else {
    passwordField.type = "password";
  }
}

function passwordGenerator() {
  const passLength = randomNumberInRange(15,20);
  let password = [];

  for(let i=0; i<passLength; i++) {
    let random = randomNumberInRange(0,10);

    if(random === 0 || random === 10) {
      password.push(passwordChars.specialChars[randomNumberInRange(0, passwordChars.specialChars.length-1)]);
    } else if (random === 1 || random === 9) {
      password.push(passwordChars.lowLetters[randomNumberInRange(0, passwordChars.lowLetters.length-1)]);
    } else if (random < 5) {
      password.push(passwordChars.capLetters[randomNumberInRange(0, passwordChars.capLetters.length-1)]);
    } else {
      password.push(passwordChars.numbers[randomNumberInRange(0, passwordChars.numbers.length-1)]);
    }
  }

  return password.join("");
}

function passwordChecker(str) {
  const minLength = 12;
  let specialChars = new RegExp(`[${passwordChars.specialChars.join("")}]`);
  let numChars = /[0-9]/;
  let alphabetChars = /[a-zA-Z]/;
  
  if(str.length < minLength || !specialChars.test(str) ||
    !numChars.test(str) || !alphabetChars.test(str)) {
    console.log("es falso")
    return false;
  } else {
    console.log("es verdadero")
    return true;
  }
}

function randomNumberInRange(min, max) {
  return Math.round((Math.random() * (max-min)) +min);
}