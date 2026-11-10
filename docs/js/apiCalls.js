export default class ApiCalls
{
    static async getResumeData(isSpanish)
    {
        const response = await fetch(`./data/${isSpanish ? 'spanish' : 'english'}.json`);
        if (!response.ok) throw new Error(`HTTP ${response.status} loading resume data`);
        return await response.json();
    }

    static async getDailyVerse()
    {
        const response = await fetch('https://beta.ourmanna.com/api/v1/get?format=json&order=daily');
        if (!response.ok) throw new Error(`HTTP ${response.status} loading the daily verse`);
        const data = await response.json();
        return data.verse.details;
    }

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
