import axios, { AxiosInstance } from 'axios';

export const weatherClient: AxiosInstance = axios.create({
  baseURL: process.env.WEATHER_URL as string,
  timeout: process.env.HTTP_CLIENT_TIMEOUT_MS
    ? parseInt(process.env.HTTP_CLIENT_TIMEOUT_MS as string, 10)
    : 5000,
});
