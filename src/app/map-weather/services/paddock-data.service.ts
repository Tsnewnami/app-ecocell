import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { DefaultDataService, HttpUrlGenerator } from "@ngrx/data";
import { AngularFirestore } from '@angular/fire/firestore';
import { Paddock } from '../models/paddock.model';


@Injectable()
export class PaddockDataService extends DefaultDataService<Paddock>{

  constructor(http: HttpClient, private fireStore: AngularFirestore, httpUrlGenerator: HttpUrlGenerator) {
    super('Paddock', http,  httpUrlGenerator);
  }

}
