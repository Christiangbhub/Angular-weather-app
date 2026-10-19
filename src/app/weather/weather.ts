import { Component, signal, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../api';
@Component({
  imports: [MatProgressSpinnerModule, ReactiveFormsModule],
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
  weather = JSON.stringify(this.weatherApi.weatherObj?.current);

  weatherAppState = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

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
        this.weatherApi.getGeolocation(city);
        console.log(this.weatherApi?.weatherObj);
        this.weatherAppState.set('success');
      }
    }, 3000);
  }
}
