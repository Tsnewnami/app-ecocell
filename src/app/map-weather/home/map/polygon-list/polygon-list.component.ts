import { PaddockApiService } from './../../../services/paddock-api.service';
import { PaddockEntityService } from './../../../services/paddock-entity.service';
import { Paddock } from './../../../models/paddock.model';
import { PolygonEntityService } from './../../../services/polygon-entity.service';
import { GoogleMapsService } from './../../../services/google-maps.service';
import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Polygon } from 'src/app/map-weather/models/polygon.model';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoadingSpinnerComponent } from 'src/app/map-weather/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-polygon-list',
  templateUrl: './polygon-list.component.html',
  styleUrls: ['./polygon-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolygonListComponent implements OnInit {
  @Input()
  polygons: Polygon[];

  @Output()
  polygonChanged = new EventEmitter<void>();

  @Output()
  polygonSelected = new EventEmitter<Polygon>();

  @Output()
  polygonDeleted = new EventEmitter<void>();

  paddocks$: Observable<Paddock[]>;
  paddocks: Paddock[]
  loaded = false;

  constructor(
    private googleMapsService: GoogleMapsService,
    private polygonEntityService: PolygonEntityService,
    private paddockEntityService: PaddockEntityService,
    private paddockApiService: PaddockApiService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
      this.paddocks$ = this.paddockEntityService.entities$
      this.paddocks$
        .subscribe(paddocks => {
          this.paddocks = paddocks;
          this.loaded = true;
        })

  }

  onPolyClick(polygon: Polygon) {
    const lat = polygon.lat;
    const long = polygon.long
    const maxLat = Math.max(...lat);
    const minLat = Math.min(...lat);
    const maxLong = Math.max(...long);
    const minLong = Math.min(...long);

    const latMid = minLat + ((maxLat - minLat) / 2);
    const longMid = minLong + ((maxLong - minLong) / 2);
    this.googleMapsService.panTo(latMid, longMid);
    this.polygonSelected.emit(polygon);
  }

  onClearPolygonAndPaddockDetails(polygon: Polygon, paddock: Paddock){
      const spinnerDialogRef =  this.dialog.open(LoadingSpinnerComponent, {
    });

    setTimeout(() => {
       spinnerDialogRef.close();
    }, 4000);

    const polyIndex = polygon.index;
    this.polygonChanged.emit();
    this.polygonDeleted.emit();
    this.googleMapsService.deletePolygon(polyIndex);
    this.paddockApiService.deletePaddock(polygon.polygonApiId)
      .subscribe(res => {
        this.polygonEntityService.removeOneFromCache(polygon);
        this.paddockEntityService.removeOneFromCache(paddock);
        this.polygonEntityService.delete(polygon.name);
      })
    // this.polygonEntityService.removeOneFromCache(polygon);
    // this.polygonEntityService.delete(polygon.name);
  }
}
