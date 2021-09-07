import { FarmEntityService } from './farm-entity.service';
import { Injectable, OnInit } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Farm } from "../models/farm.model";


@Injectable()
export class FarmGuard implements CanActivate, OnInit{
  private urlMatch$: Observable<boolean>;
  private urlMatch: boolean

  constructor(
    private router: Router,
    private farmEntityService: FarmEntityService){
  }

  ngOnInit() {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       this.urlMatch$ = this.farmEntityService.entities$
        .pipe(
          map((farms: Farm[]) => farms.some(farm => farm.name.trim() == route.url[1].path.trim()))
        );

      this.urlMatch$.subscribe(res => {
        this.urlMatch = res;

      })

      if(this.urlMatch){
        return true;
      } else{
        return this.router.createUrlTree(['/app']);
      }
    }
}
