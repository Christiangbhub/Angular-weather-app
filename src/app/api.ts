import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable, switchMap, throwError, forkJoin } from 'rxjs';

export interface GeoLocation {
  lat: number;
  lon: number;
}

interface WeatherResponse {
  name: string;
  dt: number;
  timezone: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  wind: {
    speed: number;
  };
  weather: [
    {
      main: string;
      description: string;
      icon: string;
    },
  ];
}

export interface WeatherData {
  city_name: string | null;
  temperature: number | null;
  temp_min: number;
  temp_max: number;
  feels_like: number | null;
  humidity: number | null;
  wind_speed: number;
  weatherStatus: string;
  weatherDescription: string;
  weatherIconCode: string;
  timezone: number;
  dt: number;
}

export interface HourlyWeatherData {
  timezone: number;
  list:
    | [
        {
          dt: number;
          dt_txt: string;

          main: {
            temp: number;
            feels_like: number;
            humidity: number;
            temp_min: number;
            temp_max: number;
          };
          wind: {
            speed: number;
          };
          weather: [
            {
              main: string;
              description: string;
              icon: string;
            },
          ];
        },
      ]
    | null;
}
@Service()
export class Api {
  private http = inject(HttpClient);
  apiKey = '140a5ef731e08856b0a052cb5d752c2d'; //hide this apikey

  hourlyWeather: HourlyWeatherData[] = [];

  getCurrrentWeatherData(cityName: string): Observable<WeatherData> {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${this.apiKey}`;
    return this.http.get<GeoLocation[]>(geoUrl).pipe(
      switchMap((locations) => {
        if (locations.length === 0) {
          return throwError(() => new Error('City not found'));
        }

        const { lat, lon } = locations[0];

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;

        return this.http.get<WeatherResponse>(weatherUrl).pipe(
          map((data): WeatherData => ({
            city_name: data.name,
            temperature: data.main.temp,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed,
            temp_max: data.main.temp_max,
            temp_min: data.main.temp_min,
            weatherStatus: data.weather[0].main,
            weatherDescription: data.weather[0].description,
            weatherIconCode: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            dt: data.dt,
            timezone: data.timezone,
          })),
        );
      }),
    );
  }

  // continue here

  getGeolocation(cityName: string) {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${this.apiKey}`;
    console.log(cityName);
    return this.http.get<any>(geoUrl).pipe(
      map((data) => ({
        lat: data[0].lat,
        lon: data[0].lon,
      })),
    );
  }

  getHourlyWeatherData(lat: number, lon: number) {
    const hourlyWeatherUrl = `http://api.openweathermap.org/data/2.5/forecast?`;

    return this.http
      .get<any>(hourlyWeatherUrl, {
        params: { lat: lat, lon: lon, cnt: '5', appid: this.apiKey },
      })
      .pipe(
        map((data): HourlyWeatherData => ({
          // hour: list;
          list: data.list,
          timezone: data.city.timezone,
        })),
      );
  }
}
