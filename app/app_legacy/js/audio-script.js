let audio = document.getElementById("audio");
audio.addEventListener('canplaythrough', () => { console.log("audio can be played") }, { once: true });
audio.volume = .7;
let projects = document.querySelectorAll(".project-item");
window.addEventListener('click', () => { audio.play() }, { once: true });
projects.forEach(proj => proj.addEventListener("mouseover", () => audio.play()));
