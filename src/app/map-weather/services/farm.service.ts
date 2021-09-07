import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Farm } from '../models/farm.model';

@Injectable({
  providedIn: 'root'
})
export class FarmService {
  constructor(private fireStore: AngularFirestore) { }


  pushFarmtoDb(farmName: string) {
    const userId = JSON.parse(localStorage.getItem('user'))['id'];
    return this.fireStore.collection('Users').doc(userId).collection('Farms').doc(farmName).set({name: farmName, index:  Math.round(new Date().getTime() / 1000)});
  }

}
