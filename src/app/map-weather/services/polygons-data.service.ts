import { FarmService } from './farm.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { Polygon } from '../models/polygon.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';


@Injectable()
export class PolygonsDataService extends DefaultDataService<Polygon>{

  constructor(
    http: HttpClient,
    private fireStore: AngularFirestore,
    httpUrlGenerator: HttpUrlGenerator,
    private farmService: FarmService) {
    super('Polygon', http,  httpUrlGenerator);
  }

  getAll(): Observable<Polygon[]> {
    const userId = JSON.parse(localStorage.getItem('user'))['id'];
    return this.fireStore
    .collection('Users')
    .doc(userId)
    .collection('Farms')
    .doc(this.farmService.getCurrentFarm().name)
    .collection('Polygons')
    .snapshotChanges()
    .pipe(map( docArray => {
      return docArray.map( doc => {
        return(
           {
            index: doc.payload.doc.data()['index'],
            userId: doc.payload.doc.data()['userId'],
            name: doc.payload.doc.data()['name'],
            lat: doc.payload.doc.data()['lat'],
            long: doc.payload.doc.data()['long'],
            fillColor: doc.payload.doc.data()['fillColor'],
            outlineColor: doc.payload.doc.data()['outLineColor'],
            polygonApiId: doc.payload.doc.data()['polygonApiId'],
            polyArea: doc.payload.doc.data()['polyArea'],
            paddockType: doc.payload.doc.data()['paddockType'],
            paddockFillType: doc.payload.doc.data()['paddockFillType'],
            cattleCount: doc.payload.doc.data()['cattleCount'],
         }
      );
      });
    }))
  }

  delete(key: string) :Observable<number | string> {
    const userId = JSON.parse(localStorage.getItem('user'))['id'];
    return from(this.fireStore
      .collection('Users')
      .doc(userId)
      .collection('Farms')
      .doc(this.farmService.getCurrentFarm().name)
      .collection('Polygons')
      .doc(key)
      .delete().then(() =>{
      return 1;
    }))
  }
}
