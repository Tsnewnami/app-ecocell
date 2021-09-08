import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Farm } from '../models/farm.model';

@Injectable({
  providedIn: 'root'
})
export class FarmService {
  private currentFarm: Farm;

  constructor(private fireStore: AngularFirestore) { }

  setCurrentFarm(farm: Farm) {
    this.currentFarm = farm;
  }

  getCurrentFarm() {
    return this.currentFarm;
  }

  pushFarmtoDb(farmName: string, regionName: string, regionLat: number, regionLong: number) {
    const userId = JSON.parse(localStorage.getItem('user'))['id'];
    const farm: Farm = {
        name: farmName,
        index:  Math.round(new Date().getTime() / 1000),
        region: regionName,
        regionLat: regionLat,
        regionLong: regionLong
      }

    return this.fireStore.collection('Users').doc(userId).collection('Farms').doc(farmName).set(farm);
  }

}
