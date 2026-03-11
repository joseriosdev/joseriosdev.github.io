/*special thanks to Brad Traversy*/
let hourEl = document.querySelector('.hour');
let minuteEl = document.querySelector('.minute');
let secondEl = document.querySelector('.second');
let timeEl = document.querySelector('.time');
let dateEl = document.querySelector('.date');
let toggle = document.querySelector('.toggle');

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function setTime() {
    let time = new Date();
    let month = time.getMonth();
    let day = time.getDay();
    let date = time.getDate();
    let hours = time.getHours();
    let hoursForClock = hours>=13 ? hours%12 : hours;
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    let ampm = hours>=12 ? 'PM' : 'AM';

    hourEl.style.transform = `translate(-50%, -100%) rotate(${scale(hoursForClock, 0, 11, 0, 360)}deg)`;
    minuteEl.style.transform = `translate(-50%, -100%) rotate(${scale(minutes, 0, 59, 0, 360)}deg)`;
    secondEl.style.transform = `translate(-50%, -100%) rotate(${scale(seconds, 0, 59, 0, 360)}deg)`;

    timeEl.innerHTML = `${hoursForClock}:${minutes<10 ? `0${minutes}` : minutes} ${ampm}`;
    dateEl.innerHTML = `${DAYS[day]}, ${MONTHS[month]} <span class="circle">${date}</span>`;
}

function scale(num, in_min, in_max, out_min, out_max) {
    return (num-in_min) * (out_max-out_min) / (in_max-in_min) + out_min;
}

setTime();

setInterval(setTime, 1000)