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

  constructor(
    private dialog: MatDialog,
    private farmService: FarmService,
    private router: Router,
    private route: ActivatedRoute,
    private farmEntityService: FarmEntityService,
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
  }

  onViewFarm(farm: Farm) {
    this.farmService.setCurrentFarm(farm);
    this.router.navigate([farm.name], {relativeTo: this.route})
  }

}
