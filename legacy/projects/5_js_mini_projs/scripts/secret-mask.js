let mask = document.getElementById("secret-mask");
console.log(mask)
mask.addEventListener("mouseover", () => {
	mask.classList.add("secret-mask");
	mask.addEventListener("mousemove", (evt) => {
		mask.style.setProperty("--x",`${evt.offsetX}px`);
		mask.style.setProperty("--y",`${evt.offsetY}px`);
	});
});

mask.addEventListener("mouseout", () => mask.classList.remove("secret-mask"))