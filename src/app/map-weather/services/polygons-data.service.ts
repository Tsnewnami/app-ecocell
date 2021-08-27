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

  constructor(http: HttpClient, private fireStore: AngularFirestore, httpUrlGenerator: HttpUrlGenerator) {
    super('Polygon', http,  httpUrlGenerator);
  }

  getAll(): Observable<Polygon[]> {
    const userId = JSON.parse(localStorage.getItem('user'))['id'];
    return this.fireStore.collection('userPolygons').doc(userId).collection('polygons')
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
            fillColor: doc.payload.doc.data()['fillColor']
         }
      );
      });
    }))
  }

  delete(key: string) :Observable<number | string> {
    const userId = JSON.parse(localStorage.getItem('user'))['id'];
    return from(this.fireStore.collection('userPolygons').doc(userId).collection('polygons').doc(key).delete().then(() =>{
      return 1;
    }))
  }
}
