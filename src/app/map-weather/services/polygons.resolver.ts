import { Paddock } from './../models/paddock.model';
import { PaddockApiService } from './paddock-api.service';
import { PaddockEntityService } from './paddock-entity.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { PolygonEntityService } from './polygon-entity.service';
import { Observable, of, timer, forkJoin } from 'rxjs';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { filter, first, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Polygon } from '../models/polygon.model';
import { select } from '@ngrx/store';



@Injectable()
export class PolygonsResolver implements Resolve<boolean>{
  private polygons$: Observable<Polygon[]>;
  private polygons: Polygon[]
  paddocksLoaded = false;

  constructor(
    private polygonService: PolygonEntityService,
    private paddockService: PaddockApiService,
    private paddockEntityService: PaddockEntityService) {

  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<any> | Observable<never>  {

      return this.polygonService.getAll()
      .pipe(
        switchMap(polygons => {
          const observables = polygons.map(polygon => this.paddockService.getPaddockData("test", polygon.index, polygon.lat[0], polygon.long[0], 1, 1, 1, 1, 1))

          return forkJoin(observables)
          .pipe(
            tap(paddocks => {
              paddocks.map(paddock => this.paddockEntityService.addOneToCache(paddock))
            })
          )
        })
      )

      // return this.polygonService.loaded$
      // .pipe(
      //   tap(loaded => {
      //     if (!loaded && !this.paddocksLoaded){
      //       setTimeout(() => {
      //         this.polygonService.getAll()
      //           .pipe(
      //             mergeMap(res => {
      //               console.log(res);
      //             })
      //           );

      //         // .subscribe(async (polygons) => {
      //         //   for (const polygon of polygons) {
      //         //     await this.paddockService.getPaddockData("test", polygon.index, polygon.lat[0], polygon.long[0], 1, 1, 1, 1, 1).toPromise()
      //         //       .then((res: Paddock) => {
      //         //         console.log("Paddock");
      //         //         this.paddockEntityService.addOneToCache(res);
      //         //       })

      //         //     this.paddocksLoaded = true;
      //         //   }
      //         // })

      //       }, 120);
      //     }
      //   }),

      //   filter(loaded => !!loaded), // Ensures only completes if the courses are loaded
      //   first() // Ensures that the observable is complete to allow the transition to go through
      // );
  }
}
