import { Component, signal, inject } from '@angular/core';
import { WeatherData } from '../weather-data';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
@Component({
  imports: [MatProgressSpinnerModule, ReactiveFormsModule],
  selector: 'app-weather',
  styleUrl: './weather.css',
  templateUrl: './weather.html',
})
export class Weather {
  private formBuilder = inject(FormBuilder);
  weatherForm = this.formBuilder.group({
    city: ['', Validators.required], //model
  });

  cityName: string = '';

  weatherAppState = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  testWeatherData: WeatherData = {
    id: 1,
    temp: 1,
    temp_feel: -3,
    weather_condition: 'cloudy',
    weather_icon: '/images/cloudy.png',
    weather_icon_desc: 'Cloud icon',
  };

  errorMsg = signal<'City not found' | ''>('');

  onSubmit() {
    const city = (this.weatherForm.value.city ?? '').trim();

    if (city === '') {
      return;
    }
    this.cityName = city;

    this.weatherAppState.set('loading');
    setTimeout(() => {
      if (city.toLowerCase() === 'asdf') {
        this.weatherAppState.set('error');
        this.errorMsg.set('City not found');
      } else {
        this.weatherAppState.set('success');
      }
    }, 3000);
  }
}
