import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  apiKeyXU: string = '0c67299d93814b18a0c154526191408';

  apiKeyOpenWeather: string = 'cba8a5fc391bb7b80e08a12140d9d814';
  baseUrlOpenWeather: string = 'http://api.openweathermap.org/data/2.5/weather';

  forecastUrlOpenWeather: string =
    'http://api.openweathermap.org/data/2.5/forecast';

  apiKeyAir: string = 'd60252ad-3934-4885-820b-cf3d203b97ef';
  baseUrlAir: string = 'http://api.airvisual.com/v2/nearest_city?';

  proxyurl = 'https://cors-anywhere.herokuapp.com/';

  constructor(private http: HttpClient) {}

  getWeather(location: string) {
    let url = `${this.baseUrlOpenWeather}?q=${location}&units=metric&APPID=${this.apiKeyOpenWeather}`;
    return this.http.get(`${this.proxyurl}${url}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    
  }

  getWeatherByLocation(latitude: number, longitude: number) {
    let url = `${this.baseUrlOpenWeather}?lat=${latitude}&lon=${longitude}&units=metric&APPID=${this.apiKeyOpenWeather}`;
    return this.http.get(`${this.proxyurl}${url}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  getForecast(latitude: number, longitude: number) {
    let url = `${this.forecastUrlOpenWeather}?lat=${latitude}&lon=${longitude}&units=metric&APPID=${this.apiKeyOpenWeather}`;
    return this.http.get(`${this.proxyurl}${url}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  getPollution(latitude: number, longitude: number) {
    let url = `${this.baseUrlAir}lat=${latitude}&lon=${longitude}&key=${this.apiKeyAir}`;
    return this.http.get(`${this.proxyurl}${url}`, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
