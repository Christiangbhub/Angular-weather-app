import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable, switchMap, throwError } from 'rxjs';

interface GeoLocation {
  lat: number;
  lon: number;
}

interface WeatherResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
}

export interface WeatherData {
  city_name: string;
  temperature: number;
  feels_like: number;
  humidity: number;
}

@Service()
export class Api {
  private http = inject(HttpClient);
  apiKey = '140a5ef731e08856b0a052cb5d752c2d'; //hide this apikey

  getGeoData(cityName: string): Observable<WeatherData> {
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
          })),
        );
      }),
    );
  }
}
