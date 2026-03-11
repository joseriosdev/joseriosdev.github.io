class Weather {
  constructor(city, countryAbb) {
    this.apiKey = "9eba78ec9ac861f4f1e8fe3bf07822ed";
    this.city = city;
    this.state = countryAbb;
  }

  async getWeather() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.apiKey}`);
    const responseData = await response.json();
    
    return responseData;
  }

  changeLocation(city, countryAbb) {
    this.state = countryAbb;
    this.city = city;
  }
}