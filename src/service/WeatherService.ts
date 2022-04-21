import { AxiosInstance } from 'axios';

export default class WeatherService {
  private readonly appKey = process.env.WEATHER_APP_KEY as string;
  constructor(private weatherClient: AxiosInstance) {}

  public async getEventWeather(location: string): Promise<string> {
    try {
      const response = await this.weatherClient.get(
        `/data/2.5/weather?q=${location}appid=${this.appKey}`
      );
      return response.statusText;
    } catch (error) {
      throw error;
    }
  }
}
