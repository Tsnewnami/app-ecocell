import { FarmEntityService } from './farm-entity.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { filter, first, tap } from 'rxjs/operators';



@Injectable()
export class FarmsResolver implements Resolve<boolean>{
  constructor(
    private farmService: FarmEntityService,
    private auth: AngularFireAuth) {

  }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<boolean> {

      return this.farmService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded){
            setTimeout(() => {
              this.farmService.getAll();
            }, 120);
          }
        }),
        filter(loaded => !!loaded), // Ensures only completes if the courses are loaded
        first() // Ensures that the observable is complete to allow the transition to go through
      );
  }
}
