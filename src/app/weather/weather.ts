import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, signal, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Api, HourlyWeatherData } from '../api';
import { GeoLocation } from '../api';
import { MatButtonModule } from '@angular/material/button';
import { WeatherData } from '../api';
import { MatCardModule } from '@angular/material/card';
import { single, timestamp } from 'rxjs';
@Component({
  imports: [
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  selector: 'app-weather',
  styleUrl: './weather.css',
  templateUrl: './weather.html',
})
export class Weather {
  private formBuilder = inject(FormBuilder);

  weatherApi = inject(Api);
  weatherForm = this.formBuilder.group({
    city: ['', Validators.required], //model
  });

  cityName: string = '';

  hourlyWeatherData: HourlyWeatherData = {
    list: null,
  };

  weatherData: WeatherData = {
    city_name: '',
    temperature: 0,
    feels_like: 0,
    humidity: 0,
    temp_max: 0,
    temp_min: 0,
    wind_speed: 0,
    weatherStatus: '',
    weatherDescription: '',
    weatherIconCode: '',
    time: 0,
  };
  geoLocation: GeoLocation = {
    lat: 0,
    lon: 0,
  };

  clearForm() {
    this.weatherForm.get('city')?.reset();
    this.weatherAppState.set('idle');
    this.hourlyWeatherData.list = null;
    this.hourlyDataState.set(true);
    this.currentDataState.set(true);
  }

  weatherAppState = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  hourlyDataState = signal<true | false>(true);
  currentDataState = signal<true | false>(true);

  errorMsg = signal<'City not found' | ''>('');

  kelvintoCelsius(kelvin: any) {
    if (kelvin === null) {
      return;
    }
    return Math.round((Number(kelvin - 273.15) * 100) / 100) + '°C';
  }

  hourlyWeather() {
    const city = (this.weatherForm.value.city ?? '').trim();

    if (city === '') {
      return;
    }
    this.cityName = city;
    this.weatherApi.getGeolocation(city).subscribe({
      next: (data) => {
        this.geoLocation.lat = data.lat;
        this.geoLocation.lon = data.lon;

        this.weatherApi.getHourlyWeatherData(this.geoLocation.lat, this.geoLocation.lon).subscribe({
          next: (data) => {
            this.hourlyWeatherData.list = data.list;
            this.hourlyDataState.set(false);
          },
        });
      },
    });

    console.log(this.hourlyWeatherData);
  }

  getTime(timeInput: number) {
    const time = new Date(timeInput * 1000);

    const timeString = time.toLocaleTimeString('en-US', {
      hour12: true,
      timeZone: 'UTC',
      hour: 'numeric',
      minute: '2-digit',
    });

    return timeString;
  }

  getDate(date: string) {
    const newDate = new Date(date);

    const datetring = newDate.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      weekday: 'short',
    });

    return datetring;
  }

  currentWeather() {
    this.weatherApi.getCurrrentWeatherData(this.cityName).subscribe({
      next: (data) => {
        this.weatherData.city_name = data.city_name;
        this.weatherData.temperature = data.temperature;
        this.weatherData.feels_like = data.feels_like;
        this.weatherData.humidity = data.humidity;
        this.weatherData.wind_speed = data.wind_speed;
        this.weatherData.temp_max = data.temp_max;
        this.weatherData.temp_min = data.temp_min;
        this.weatherData.weatherStatus = data.weatherStatus;
        this.weatherData.weatherDescription = data.weatherDescription;
        this.weatherData.weatherIconCode = data.weatherIconCode;
        this.weatherData.time = data.time;

        this.weatherAppState.set('success');
        this.currentDataState.set(false);
      },
      error: (error) => {
        this.weatherAppState.set('error');
        console.log(error);
        this.errorMsg.set('City not found');
      },
    });
  }

  onSubmit() {
    const city = (this.weatherForm.value.city ?? '').trim();

    if (city === '') {
      return;
    }
    this.cityName = city;

    this.weatherAppState.set('loading');

    this.currentWeather();
  }
}
