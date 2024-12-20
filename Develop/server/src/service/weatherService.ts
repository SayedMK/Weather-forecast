import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public temperature: number,
    public description: string,
    public icon: string,
  ) {}
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}';
  private apiKey = process.env.WEATHER_API_KEY;


  // TODO: Create fetchLocationData method
   private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch
    (`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    return response.json();
   }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }


  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }
  

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return this.destructureLocationData(locationData);  
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { main, weather } = response;
    return new Weather(main.temp, weather[0].description, weather[0].icon);
  }
    // TODO: Complete getWeatherForCity method
    private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
      const forecastArray = weatherData.map((weather: any) => {
        return new Weather(weather.temp, weather.description, weather.icon);
      });
      forecastArray.unshift(currentWeather);
      return forecastArray;
    }
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherResponse = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherResponse);
    const forecastWeather = await this.fetchWeatherData(coordinates);
    return this.buildForecastArray(currentWeather, forecastWeather);
  }
}

export default new WeatherService();


