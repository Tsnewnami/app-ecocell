import { PolygonEntityService } from './../../../services/polygon-entity.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Polygon } from 'src/app/map-weather/models/polygon.model';



@Component({
  selector: 'app-complete-polygon',
  templateUrl: './complete-polygon.component.html',
  styleUrls: ['./complete-polygon.component.css']
})
export class CompletePolygonComponent implements OnInit {
  paddockNameC : string;
  polygons$: Observable<Polygon[]>;
  private polygons: Polygon[]
  duplicateFound: boolean = false;
  crop = false;
  pasture = false;
  orchard = false;
  cattle = false;
  paddockFill: string = "other";
  defaultInputCalves = 0;
  defaultInputBulls = 0;
  defaultInputHeffas = 0;
  defaultCroptype = "corn";
  defaultPastureType = "modified-pasture";
  defaultOrchardType = "macadamia";

  constructor(
    private polygonEntityService: PolygonEntityService,
    public dialogRef: MatDialogRef<CompletePolygonComponent>) {
      dialogRef.disableClose = true;
    }

  ngOnInit(): void {
    this.polygons$ = this.polygonEntityService.entities$
    this.polygons$
      .subscribe(polygons => {
        this.polygons = polygons as Polygon[];
      })
  }

  onClose(paddockName: string): void {
    this.dialogRef.close([
      paddockName,
      this.crop,
      this.pasture,
      this.orchard,
      this.paddockFill,
      this.cattle,
      [this.defaultInputBulls, this.defaultInputCalves, this.defaultInputHeffas]
    ]);
  }

  validation(name: string) {
    this.polygons.forEach(polygon => {
      if (polygon.name.replace(/^\s+|\s+$/g, '') === name.trim()) {
        this.duplicateFound = true; // now your error will be displayed in browser
      } else{
        this.duplicateFound = false;
      }
    });
  }

  onPaddockTypeChange(event) {
    this.orchard = false;
    this.crop = false;
    this.pasture = false;

    if (event.value == 'pasture') {
      this.pasture = true;
      this.paddockFill = "modified pasture";
    } else if (event.value == 'crop') {
      this.crop = true;
      this.paddockFill = "corn";
    } else if (event.value == 'orchard') {
      this.orchard = true;
      this.paddockFill = "macadamia";
    }

  }

  onChangeCattle() {
    this.cattle = !this.cattle;
  }

  onPaddockFillType(event) {
    this.paddockFill = event.value;
  }

  onDialogClose() {
    this.dialogRef.close();
  }

}
