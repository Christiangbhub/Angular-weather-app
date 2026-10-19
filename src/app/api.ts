import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class Api {
  private http = inject(HttpClient);

  latitude: any;
  longitude: any;
  weatherObj: any;

  getGeolocation(city: string) {
    this.http
      .get<any>(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`,
      )
      .subscribe({
        next: (data) => {
          this.latitude = data.results[0].latitude;
          this.longitude = data.results[0].longitude;
          this.getWeatherForecast(this.latitude, this.longitude);
        },
        error: (error) => console.log(error),
      });
  }

  getWeatherForecast(latitude: number, longitude: number) {
    this.http
      .get<any>(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=temperature_2m`,
      )
      .subscribe({
        next: (data) => (this.weatherObj = data),
        error: (error) => console.log(error),
      });
  }
}
