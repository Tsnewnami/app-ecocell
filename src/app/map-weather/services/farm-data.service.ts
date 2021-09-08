import { Farm } from './../models/farm.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';


@Injectable()
export class FarmDataService extends DefaultDataService<Farm>{

  constructor(http: HttpClient, private fireStore: AngularFirestore, httpUrlGenerator: HttpUrlGenerator) {
    super('Farm', http,  httpUrlGenerator);
  }

  getAll(): Observable<Farm[]> {
    const userId = JSON.parse(localStorage.getItem('user'))['id'];
    return this.fireStore.collection('Users').doc(userId).collection('Farms')
    .snapshotChanges()
    .pipe(map( docArray => {
      return docArray.map( doc => {
        return(
           {

            index: doc.payload.doc.data()['index'],
            name: doc.payload.doc.data()['name'],
            region: doc.payload.doc.data()['region'],
            regionLat: doc.payload.doc.data()['regionLat'],
            regionLong: doc.payload.doc.data()['regionLong'],
         }
      );
      });
    }))
  }

  delete(key: string) :Observable<number | string> {
    const userId = JSON.parse(localStorage.getItem('user'))['id'];
    return from(this.fireStore.collection('Users').doc(userId).collection('Farms').doc(key).delete().then(() =>{
      return 1;
    }))
  }
}
