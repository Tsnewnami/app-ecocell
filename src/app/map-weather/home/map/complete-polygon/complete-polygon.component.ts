import { PolygonEntityService } from './../../../services/polygon-entity.service';
import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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

  validation(name: string) {
    this.polygons.forEach(polygon => {
      if (polygon.name.replace(/^\s+|\s+$/g, '') === name) {
        this.duplicateFound = true; // now your error will be displayed in browser
      } else{
        this.duplicateFound = false;
      }
    });
  }

}
