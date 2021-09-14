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

          if (polygons.length == 0) {
            return of({});
          } else {
            const observables = polygons.map(polygon => this.paddockService.getPaddockData(polygon.polygonApiId, polygon.index, polygon.lat[0], polygon.long[0], 1, 1, 1, 1, 1, polygon.paddockFillType))

            return forkJoin(observables)
            .pipe(
              tap(paddocks => {
                paddocks.map(paddock => this.paddockEntityService.addOneToCache(paddock))
              })
            )
          }
        })
      )
  }
}
