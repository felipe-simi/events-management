import { AxiosInstance } from 'axios';
import Event from '../model/Event';
import { WeatherDetailDto } from './dto/WeatherDetailDto';

export default class WeatherService {
  private readonly appKey = process.env.WEATHER_APP_KEY as string;
  constructor(private weatherClient: AxiosInstance) {}

  public async getEventWeather(
    event: Event
  ): Promise<WeatherDetailDto | undefined> {
    const location = event.location;
    try {
      const response = await this.weatherClient.get<WeatherResponse>(
        `data/2.5/onecall?exclude=hourly,minutely,current&units=metric&lat=${location.latitudeIso}&lon=${location.longitudeIso}&appid=${this.appKey}`
      );
      const MS = 1000;
      const eventWeather = response.data.daily.find((weather) =>
        this.isEqualDate(new Date(weather.dt * MS), event.eventDate)
      );
      if (eventWeather) {
        return {
          chanceOfRain: eventWeather.pop,
          temperatureInDegreesCelcius: eventWeather.temp.day,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  private isEqualDate(first: Date, second: Date): boolean {
    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  }
}

interface WeatherResponse {
  daily: WeatherDaily[];
}

interface WeatherDaily {
  dt: number;
  temp: WeatherTemperature;
  pop: number;
}

interface WeatherTemperature {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}
