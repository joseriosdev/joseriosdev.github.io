// FILE CREATED AS A NOTEBOOK FOR OOP IN JS / EXERCIES HERE

//ES6 Classes works equaly than protos under the hood, here's a syntax example
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  // method that can be use with the obj created
  greeting() {
    console.log(`Hello ${this.firstName} ${this.lastName}!`);
  }
  // static method can only be used with the class itself
  static multiplicator(a,b) {
    return a*b;
  }
}
let clara = new Person("Clara", "Guzman");

//Finally we can do the same inherit thing but is called now EXTENDS, just like this:
class Customer extends Person {
  constructor(firstName, lastName, membership) {
    //since we're extending it, we should use the super() and fetch those vars here
    super(firstName, lastName);
    this.membership = membership;
  }
}
var esperancita = new Customer("Esperanza", "Suarez", "gold");
/*
Prototypes can inherit from other prototypes, things like vars and methods. EX:
*/
//Dragon constructor
function Dragon(fName, lName, nickName) {
  this.fName = fName;
  this.lName = lName;
  this.nickName = nickName;
}

Dragon.prototype.greeting = function() {
  console.log(`Hi there ${this.fName} ${this.lName}`);
}

//Dragon customer constructor
function DragonCustomer(fName, lName, nickName, phone, membership) {
  Dragon.call(this, fName, lName, nickName);
  //obj.call() -> allows us to call any function or var from any contex to the current one
  this.phone = phone;
  this.membership = membership;
}

DragonCustomer.prototype = Object.create(Dragon.prototype);
//by doing the prev line of code DragonCustomer is now inheriting from Dragon
//that's nice but it's returning the proto of Dragon and not DragonCustomer as it should
//that's why we write:
DragonCustomer.prototype.constructor = DragonCustomer;

const redDragon = new Dragon("Jake", "Long", "East Dragon");
const blackDragonConstumer = new DragonCustomer("Toothless", "Chimuelo", "Night Fury", "1234", "vip");

/*
Everything in JS it's a prototype
prev exercies shows the object itself but we can add the methods to an additional layers
which is his prototype, that actually it's already inhereting some aspects from the OBJ protoptype from JS
so we can create our own prototype that it's also a class here.
*/

function Car(color, brand, type, year) {
  this.color = color;
  this.brand = brand;
  this.type = type;
  this.year = year;
}

Car.prototype.printCarInfo = function() {
  return `${this.brand} ${this.type} ${this.year} color ${this.color}`
}

const carro = new Car("black", "toyota", "corolla", 2021);


//Small practice, knowing and understanding object literal, and THIS keyword

function Persona(firstName, lastName, dob) {
  this.name = firstName;
  this.lastName = lastName;
  this.fullName = `${firstName} ${lastName}`;
  this.dob = new Date(dob);
  //this.age = getAge();

  //private
  function sum(a,b) {
    return a+b;
  }
  //public
  this.saludo = function() {
    console.log(`¡Hola! Me llamo ${this.fullName} y tengo ${this.getAge()} años de edad.`);
    console.log(`Fijate que a+b es ${sum(2,5)}`);
  }

  this.getAge = function() {
    const diff = Date.now() - this.dob.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  }
}

let jose = new Persona("Jose", "Rios", "04/11/1937");