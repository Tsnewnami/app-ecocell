import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaddockApiService {
  constructor(private httpClient: HttpClient) { }

  createPolygon(name: string, long: number[], lat: number[]): Observable<string>{
    const data = {'name': name, 'long': long, 'lat': lat };
    return this.httpClient.post('https://us-central1-app-ecocell.cloudfunctions.net/paddockDataApi/create-polygon', data, {responseType: 'text'});
  }

  deletePolygon(polyId: string) {
    const data = {'polyId': polyId};
    return this.httpClient.post('https://us-central1-app-ecocell.cloudfunctions.net/paddockDataApi/delete-polygon', data);
  }

  getAllPolygonData(
    polyId: string,
    lat: number[],
    long: number[],
    startTimeSoil: number,
    endTimeSoil: number,
    startTimeAcc: number,
    endTimeAcc: number,
    temperatureThresh: number) {
    const data = {
      'polyId': '612db75ea81b765fd867eee3',
      'lat': lat,
      'long': long,
      'starTimeSoil': startTimeSoil,
      'endTimeSoil': endTimeSoil,
      'startTimeAcc': startTimeAcc,
      'endTimeAcc': endTimeAcc,
      'temperatureThresh': temperatureThresh
    }

    this.httpClient.post('http://localhost:5001/app-ecocell/us-central1/paddockDataApi', data)
        .subscribe(res => {
          console.log(res);
        })
  }
}
