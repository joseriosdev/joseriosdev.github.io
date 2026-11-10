// 1st Project
/*
Task
Create a clickable button with the next condition:
The button's initial text label is 0. After each click, the button must increment by 1.
Recall that the button's text label is the JS object's innerHTML property.
*/
const BTN = document.getElementById('btn');
let clickCount = 0;

BTN.addEventListener('click', function(evt){
    clickCount++;
    BTN.innerHTML = clickCount;
});
/////////////////////////////////////// END OF FIRST (1ST) MINI-PROJECT



// 2nd Project
/*
Task
We want to create nine buttons enclosed in a 'div', laid out so they form a 3x3 grid.
Each button has a distinct label from 1 to 9, and the labels on the outer buttons
must rotate in the clockwise direction each time we click the middle button.
*/
const BTN5 = document.getElementById('btn5');
      
const REMAING_BTNS = [
document.getElementById('btn-one'),
document.getElementById('btn2'),
document.getElementById('btn3'),
document.getElementById('btn4'),
document.getElementById('btn6'),
document.getElementById('btn7'),
document.getElementById('btn8'),
document.getElementById('btn9')
];

BTN5.addEventListener('click', function(evt){
  for (let i=0; i<REMAING_BTNS.length; i++) {
    switch (REMAING_BTNS[i].innerHTML) {
      case '1':
        REMAING_BTNS[i].innerHTML = '4';
        break;
      case '2':
        REMAING_BTNS[i].innerHTML = '1';
        break;
      case '3':
        REMAING_BTNS[i].innerHTML = '2';
        break;
      case '4':
        REMAING_BTNS[i].innerHTML = '7';
        break;
      case '6':
        REMAING_BTNS[i].innerHTML = '3';
        break;
      case '7':
        REMAING_BTNS[i].innerHTML = '8';
        break;
      case '8':
        REMAING_BTNS[i].innerHTML = '9';
        break;
      case '9':
        REMAING_BTNS[i].innerHTML = '6';
        break;
    }
  }          
});
/////////////////////////////////////// END OF SECOND (2ND) MINI-PROJECT



// 3rd Project
/*
Task
Implement a simple calculator that performs the following operations on binary numbers:
addition, subtraction, multiplication, and division.
Note that division operation must be integer division only;
for example, 1001/100=10, 1110/101=10, and 101/1=101.
*/

let result = document.getElementById('res');

let operator = {
    sum : false,
    sub : false,
    mul : false,
    div : false
};

const BTNS = {
    zero : document.getElementById('btn0'),
    one : document.getElementById('btn1'),
    clear : document.getElementById('btnClr'),
    equal : document.getElementById('btnEql'),
    sum : document.getElementById('btnSum'),
    subtraction : document.getElementById('btnSub'),
    multiplication : document.getElementById('btnMul'),
    division : document.getElementById('btnDiv')
}

BTNS.zero.addEventListener('click', function(evt){
    let str = gettingResStr();
    result.innerHTML = `${str}0`;
});
BTNS.one.addEventListener('click', function(evt){
    let str = gettingResStr();
    result.innerHTML = `${str}1`;
});

//Operators SETS
BTNS.sum.addEventListener('click', function(evt){
    let str = gettingResStr();
    result.innerHTML = `${str}+`;
    operator.sum = true;
    operator.sub = false;
    operator.mul = false;
    operator.div = false;
});
BTNS.subtraction.addEventListener('click', function(evt){
    let str = gettingResStr();
    result.innerHTML = `${str}-`;
    operator.sum = false;
    operator.sub = true;
    operator.mul = false;
    operator.div = false;
});
BTNS.multiplication.addEventListener('click', function(evt){
    let str = gettingResStr();
    result.innerHTML = `${str}*`;
    operator.sum = false;
    operator.sub = false;
    operator.mul = true;
    operator.div = false;
});
BTNS.division.addEventListener('click', function(evt){
    let str = gettingResStr();
    result.innerHTML = `${str}/`;
    operator.sum = false;
    operator.sub = false;
    operator.mul = false;
    operator.div = true;
});

//Putting the result on screen
BTNS.equal.addEventListener('click', function(evt){
   let num = Math.floor(binaryMaths(gettingResStr()));
   result.innerHTML =  num.toString(2);
});

//Clear result div
BTNS.clear.addEventListener('click', function(evt){
    result.innerHTML = ``;
});

//Getting the result div string
function gettingResStr () {
return result.innerHTML;
}

//Spliting the result div string and doing the maths
function binaryMaths(str) {
    let regExp = /[\+\-\*\/]/
    let twoBinaries = str.split(regExp);
    let a = binaryToInt(twoBinaries[0]);
    let b = binaryToInt(twoBinaries[1]);
    
    if (operator.sum) {
        return a + b;
    } else if (operator.sub) {
        return a - b;
    } else if (operator.mul) {
        return a * b;
    } else {
        return a / b;
    }
    
}

//Main core logic here, converting binaries to integers
function binaryToInt(str) {
    let result = str[str.length-1] === "1" ? 1 : 0;

    for (let i=str.length-2, j=1; i>=0; i--) {
        j = j*2;
        if (str[i] === "1") {
            result+=j;
        }
    }
    return result;
}
/////////////////////////////////////// END OF LAST (3RD) MINI-PROJECT