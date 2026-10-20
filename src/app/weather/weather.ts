import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Component, signal, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../api';
import { MatButtonModule } from '@angular/material/button';
import { WeatherData } from '../api';
@Component({
  imports: [
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
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

  weatherData: WeatherData = {
    city_name: '',
    temperature: 0,
    feels_like: 0,
    humidity: 0,
  };

  weatherAppState = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  errorMsg = signal<'City not found' | ''>('');

  kelvintoCelsius(kelvin: any) {
    return Math.round((Number(kelvin - 273.15) * 100) / 100);
  }

  onSubmit() {
    const city = (this.weatherForm.value.city ?? '').trim();

    if (city === '') {
      return;
    }
    this.cityName = city;

    this.weatherAppState.set('loading');
    this.weatherApi.getGeoData(this.cityName).subscribe({
      next: (data) => {
        this.weatherData.city_name = data.city_name;
        this.weatherData.temperature = data.temperature;
        this.weatherData.feels_like = data.feels_like;
        this.weatherData.humidity = data.humidity;
        this.weatherAppState.set('success');
      },
      error: (error) => {
        this.weatherAppState.set('error');
        console.log(error);
        this.errorMsg.set('City not found');
      },
    });
  }
}
