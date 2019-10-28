import { Component, OnInit } from "@angular/core";
import { SearchService } from "../../services/search.service";
import { FormControl } from "@angular/forms";
import { debounceTime, switchMap } from "rxjs/operators";
import { distinctUntilChanged } from "rxjs/operators";
import { FormBuilder, FormGroup } from "@angular/forms";

import { Weather } from "../weather";
import { Observable } from "rxjs";
import { Pollution } from "../pollution";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  public weather: any;
  public forecast: any;
  public weatherSearchForm: FormGroup = new FormGroup({
    location: new FormControl()
  });
  public pollutionIndex: number;
  public pollutionStatus: string;

  public pollution: any;
  public currentLat: number;
  public currentLong: number;

  constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.weatherSearchForm = this.formBuilder.group({
      location: [""]
    });

    //locate city by GPS
    if (navigator.geolocation) {
 
      navigator.geolocation.getCurrentPosition(
        position => {
          this.getWeatherByGPS(position);     
        },
        error => {
          switch (error.code) {
            case 3:
              // ...deal with timeout
              break;
            case 2:
              // ...device can't get data
              break;
            case 1:
              //New York location
              this.searchService
                .getWeatherByLocation(40.73, -73.99)
                .subscribe(data => {
                  this.weather = data;
                  console.log(this.weather);
                  //get pollution
                  this.sendToAir(this.weather);
                  //get forecast
                  this.sendToOpenWeatherForecast(this.weather);
                });
                
          }
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getWeatherByGPS(position) {
    this.currentLat = position.coords.latitude;
    this.currentLong = position.coords.longitude;
    this.searchService
      .getWeatherByLocation(this.currentLat, this.currentLong)
      .subscribe(data => {
        this.weather = data;
        //get pollution
        this.sendToAir(this.weather);
        
        
        //get forecast
        this.sendToOpenWeatherForecast(this.weather);
      });
  }

  sendToOpenWeather(formValues) {
    let city = formValues.location;
    //console.log(formValues);
    this.searchService.getWeather(city).subscribe(data => {
      this.weather = data;
      this.weatherSearchForm.get("location").setValue("");
      //unfocus search
      document.getElementById("form-autocomplete-4").blur();
      console.log(this.weather);
      //get pollution
      this.sendToAir(this.weather);
      //
      //get forecast
      this.sendToOpenWeatherForecast(this.weather);
    });
    
  }

  //get pollution from AirQuality API
  sendToAir(weather: Weather) {
    //get location, call getPollution
    let lat = weather.coord.lat;
    let lon = weather.coord.lon;

    this.searchService.getPollution(lat, lon).subscribe(data => {
      this.pollution = data;
      console.log(this.pollution);
      this.pollutionIndex = this.pollution.data.current.pollution.aqius;
      
    });
    
  }

  //get forecast from OpenWeather API
  sendToOpenWeatherForecast(weather: Weather) {
    //get location, call getPollution
    let lat = weather.coord.lat;
    let lon = weather.coord.lon;

    this.searchService.getForecast(lat, lon).subscribe(data => {
      let forecastFiltered = [];

      let rawData = data["list"];
      for (let i = 0; i <= rawData.length; i += 7) {
        forecastFiltered.push(rawData[i]);
      }
      console.log(data);
      this.forecast = forecastFiltered;

      console.log(this.forecast);
    });
  }


  //styles for card with pollution
  calculateStyles() {
    if (this.pollutionIndex <= 50) {
      this.pollutionStatus = 'Good';
      return {
        "color": '#004e00',
      };
    } else if (this.pollutionIndex >= 51 && this.pollutionIndex < 100) {
      this.pollutionStatus = 'Moderate';
      return {
        "color": '#ff8000',
      };
    } else if (this.pollutionIndex >= 101 && this.pollutionIndex < 150) {
      this.pollutionStatus = 'Unhealthy for sensative groups';
      return {
        "color": '#d6864f',
      };
    } else if (this.pollutionIndex >= 151 && this.pollutionIndex < 200) {
      this.pollutionStatus = 'Unhealthy';
      return {
        "color": '#fe6a69',
      };
    } else if (this.pollutionIndex >= 201 ) {
      this.pollutionStatus = 'Very unhealthy';
      return {
        "color": '#5b4675',
      };
    }
  }
}
