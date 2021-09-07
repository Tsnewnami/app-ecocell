import { FarmEntityService } from './../services/farm-entity.service';
import { GoogleMapsService } from './../services/google-maps.service';
import { FarmDialogComponent } from './farm-dialog/farm-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FarmService } from '../services/farm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Farm } from '../models/farm.model';


@Component({
  selector: 'app-create-farm',
  templateUrl: './create-farm.component.html',
  styleUrls: ['./create-farm.component.css']
})
export class CreateFarmComponent implements OnInit {
  farms$: Observable<Farm[]>;
  private farms: Farm[]

  constructor(
    private dialog: MatDialog,
    private googleMapsService: GoogleMapsService,
    private farmService: FarmService,
    private router: Router,
    private route: ActivatedRoute,
    private farmEntityService: FarmEntityService
  ) { }

  ngOnInit(): void {
    this.farms$ = this.farmEntityService.entities$;
    this.farms$
      .subscribe(farms => {
        this.farms = farms;
      })
  }

  onCreateFarm() {
    const dialogRef = this.dialog.open(FarmDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.farmService.pushFarmtoDb(result[0].trim())
          .then(() => {
            setTimeout(() => {
              this.router.navigate([result[0]], {relativeTo: this.route})
            }, 120);
          })
          .catch(err => {
            console.log(err);
          })
      } else{
        return;
      }

    })
  }

}
