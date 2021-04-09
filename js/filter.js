// projectItem variable exists in audio-script.js file
let filter = document.getElementById("filter");
filter.addEventListener("change", filterLogic)

function filterLogic() {
  let filterValue = filter.value;
  if(filterValue === "all") {
    projectItem.forEach(elmnt => {
      elmnt.classList.add("block");
      elmnt.classList.remove("hide");
    });
  }
  else {
    let temporaryProjList = document.querySelectorAll(`.${filterValue}`);
    projectItem.forEach(elmnt => elmnt.classList.add("hide"));
    temporaryProjList.forEach(elmnt => {
      elmnt.classList.remove("hide")
      elmnt.classList.add("block")
    });
  }
}