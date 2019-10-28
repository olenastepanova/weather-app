export interface Weather {
  coord: {
    lat: number;
    lon: number;
  };
  name: string;
  sys: {
    country: string;
  };
  weather: [];
  main: {
    humidity: number;
    pressure: number;
    temp: number;
    temp_min:number;
    temp_max:number
  };
  wind: {
    speed: number;
  };
}
