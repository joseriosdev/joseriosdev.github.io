let audio = document.getElementById("audio");
let projectItem = document.querySelectorAll(".project-item");
audio.volume = .7;

projectItem.forEach(element => element.addEventListener("mouseover", playSfx));

function playSfx() {
  audio.play();
}