import { AngularFireAuth } from '@angular/fire/auth';
import { PolygonEntityService } from './polygon-entity.service';
import { Observable, timer } from 'rxjs';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { filter, first, tap } from 'rxjs/operators';



@Injectable()
export class PolygonsResolver implements Resolve<boolean>{
  constructor(
    private polygonService: PolygonEntityService,
    private auth: AngularFireAuth) {
  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<boolean> {

      return this.polygonService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded){
            setTimeout(() => {
              this.polygonService.getAll();
            }, 120);
          }
        }),
        filter(loaded => !!loaded), // Ensures only completes if the courses are loaded
        first() // Ensures that the observable is complete to allow the transition to go through
      );
  }
}
