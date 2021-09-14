import { PaddockApiService } from './../services/paddock-api.service';
import { PolygonEntityService } from './../services/polygon-entity.service';
import { FarmEntityService } from './../services/farm-entity.service';
import { GoogleMapsService } from './../services/google-maps.service';
import { FarmDialogComponent } from './farm-dialog/farm-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FarmService } from '../services/farm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, forkJoin, tap, of, concatMap, delay } from 'rxjs';
import { Farm } from '../models/farm.model';
import { Polygon } from '../models/polygon.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { ThrowStmt } from '@angular/compiler';
import { RESET } from '@ngrx/store-devtools/src/actions';


@Component({
  selector: 'app-create-farm',
  templateUrl: './create-farm.component.html',
  styleUrls: ['./create-farm.component.css']
})
export class CreateFarmComponent implements OnInit {
  farms$: Observable<Farm[]>;

  constructor(
    private dialog: MatDialog,
    private farmService: FarmService,
    private router: Router,
    private route: ActivatedRoute,
    private farmEntityService: FarmEntityService,
    private fireStore: AngularFirestore,
    private paddockApiService: PaddockApiService,
    private polygonEntityService: PolygonEntityService,
  ) { }

  ngOnInit(): void {
    this.farms$ = this.farmEntityService.entities$;
  }

  onCreateFarm() {
    const dialogRef = this.dialog.open(FarmDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.farmService.pushFarmtoDb(result[1].trim(), result[2].trim(), result[0][0], result[0][1])
      } else{
        return;
      }

    })
  }

  onDeleteFarm(farm: Farm) {
    this.farmEntityService.delete(farm.name);
    this.farmEntityService.removeOneFromCache(farm);
    this.getAllFarmPolygons(farm.name)
        .subscribe(res => {
          if(res.length) {
            const userId = JSON.parse(localStorage.getItem('user'))['id'];
            res.map(polygon => this.fireStore.collection('Users').doc(userId).collection('Farms').doc(farm.name).collection('Polygons').doc(polygon.name).delete());
            of(...res)
              .pipe(
                concatMap((polygon: Polygon) => this.paddockApiService.deletePaddock(polygon.polygonApiId)),
                delay(5000)
              )
              .subscribe(result => console.log(result));
          } else{
            return;
          }
        })

  }

  onViewFarm(farm: Farm) {
    this.farmService.setCurrentFarm(farm);
    this.router.navigate([farm.name], {relativeTo: this.route})
  }

  getAllFarmPolygons(farmName: string): Observable<Polygon[]> {
    const userId = JSON.parse(localStorage.getItem('user'))['id'];
    return this.fireStore
    .collection('Users')
    .doc(userId)
    .collection('Farms')
    .doc(farmName)
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


}
