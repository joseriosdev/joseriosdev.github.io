class UI {
  constructor() {
    this.location = document.getElementById("w-location");
    this.description = document.getElementById("w-description");
    this.mainWeather = document.getElementById("w-main");
    this.humidity = document.getElementById("w-humidity");
    this.pressure = document.getElementById("w-pressure");
    this.wind = document.getElementById("w-wind");
  }

  paint(weather) {
    this.location.textContent = `${weather.name}, ${weather.sys.country}`;
    this.mainWeather.textContent = `${kelvinToCelsius(weather.main.temp)} c°`;
    this.description.textContent = `${weather.weather[0].main}, ${weather.weather[0].description}`;
    this.humidity.textContent = "Humidity: " + weather.main.humidity + " %rh";
    this.pressure.textContent = "Pressure: " + weather.main.pressure + " atm";
    this.wind.textContent = "Wind speed: " + weather.wind.speed + " mph";
  }
}

function kelvinToCelsius(temp) {
  return (temp - 273.15).toFixed(1);
}