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
    console.log("deleting polygon");
    return this.httpClient.post('https://us-central1-app-ecocell.cloudfunctions.net/paddockDataApi/delete-polygon', data);
  }
}
