import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Polygon } from 'src/app/map-weather/models/polygon.model';

@Component({
  selector: 'app-farm-dialog',
  templateUrl: './farm-dialog.component.html',
  styleUrls: ['./farm-dialog.component.css']
})
export class FarmDialogComponent implements OnInit {
  farmNameC: string;
  duplicateFound: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<FarmDialogComponent>) {
      dialogRef.disableClose = true;
    }

  ngOnInit(): void {

  }

  validation(name: string) {
  }
}
