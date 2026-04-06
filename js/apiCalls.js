export default class ApiCalls
{
  static async getWeather(city, country)
  {
    const kelvinToCelsius = temp => temp - 273.15;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=9eba78ec9ac861f4f1e8fe3bf07822ed`);
    const data = await response.json();
    data.main.feels_like = kelvinToCelsius(data.main.feels_like);
    return data;
  }

  static async getLocation()
  {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data;
  }
}
//https://beta.ourmanna.com/api/v1/get - https://github.com/wldeh/bible-api - https://unsplash.com/developers - https://www.biblegateway.com/passage/?search=Ephesians%201%3A7&version=NVI - i commit and push to github an api key, is there a way to remove that specify line of code from all previous commits? - 