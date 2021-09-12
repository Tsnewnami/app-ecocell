import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Paddock } from '../models/paddock.model';

@Injectable({
  providedIn: 'root'
})
export class PaddockApiService {
  constructor(private httpClient: HttpClient) { }

  createPaddock(name: string, long: number[], lat: number[]): Observable<string>{
    const data = {'name': name, 'long': long, 'lat': lat };
    return this.httpClient.post('https://us-central1-app-ecocell.cloudfunctions.net/paddockDataApi/create-polygon', data, {responseType: 'text'});
  }

  deletePaddock(polyId: string) {
    const data = {'polyId': polyId};
    return this.httpClient.post('https://us-central1-app-ecocell.cloudfunctions.net/paddockDataApi/delete-polygon', data);
  }

  getPaddockData(
    polyId: string,
    polyIndex: number,
    lat: number,
    long: number,
    startTimeSoil: number,
    endTimeSoil: number,
    startTimeAcc: number,
    endTimeAcc: number,
    temperatureThresh: number,
    polyFillType: string,
    ): Observable<Paddock> {

    const data = {
      'polyId': '612db75ea81b765fd867eee3',
      'polyIndex': polyIndex,
      'lat': lat,
      'long': long,
      'starTimeSoil': startTimeSoil,
      'endTimeSoil': endTimeSoil,
      'startTimeAcc': startTimeAcc,
      'endTimeAcc': endTimeAcc,
      'temperatureThresh': temperatureThresh,
      'polyFillType': polyFillType
    }

    return this.httpClient.post('http://localhost:5001/app-ecocell/us-central1/paddockDataApi/all-paddock-data', data)
              .pipe(
                map(res => {
                  return({
                    index: res['index'],
                    soilData: res['soilData'],
                    weatherData: res['weatherData'],
                    polygonApiId: res['polygonApiId'],
                    healthStatus: res['healthStatus'],
                    nvdiData: res['nvdiData']
                  })
                })
              );
  }


}
