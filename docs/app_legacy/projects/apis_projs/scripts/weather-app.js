const storage = new Storing();
const weatherLocation = storage.getLocationData();
const weather = new Weather(weatherLocation);
const ui = new UI();

document.addEventListener("DOMContentLoaded", getWeather);
document.getElementById("w-change-btn").addEventListener("click", () => {
  const city = document.getElementById("city").value;

  weather.changeLocation(city);
  storage.setLocationData(city);
  getWeather();
});

function getWeather() {
  weather.getWeather()
  .then(res => {
    ui.paint(res);
  })
  .catch(err => console.log(err));
}