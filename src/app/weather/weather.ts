import { Component, signal, inject } from '@angular/core';
import { WeatherData } from '../weather-data';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
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

  weatherAppState = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  testWeatherData: WeatherData = {
    id: 1,
    temp: 50,
    weather_condition: 'cloudy',
    weather_icon: '/images/cloudy.png',
  };

  onSubmit() {
    // event.preventDefault();
    console.log(this.weatherForm.value);
    this.weatherAppState.set('loading');
    setTimeout(() => {
      this.weatherAppState.set('success');
    }, 3000);
  }
}
