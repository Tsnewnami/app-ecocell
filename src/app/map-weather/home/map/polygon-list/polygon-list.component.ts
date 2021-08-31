import { PaddockApiService } from './../../../services/paddock-api.service';
import { PolygonEntityService } from './../../../services/polygon-entity.service';
import { GoogleMapsService } from './../../../services/google-maps.service';
import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Polygon } from 'src/app/map-weather/models/polygon.model';

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
  polygonChanged = new EventEmitter();

  constructor(
    private googleMapsService: GoogleMapsService,
    private polygonEntityService: PolygonEntityService,
    private paddockService: PaddockApiService) { }

  ngOnInit(): void {

  }

  onPolyClick(lat: number[], long: number[]) {
    const maxLat = Math.max(...lat);
    const minLat = Math.min(...lat);
    const maxLong = Math.max(...long);
    const minLong = Math.min(...long);

    const latMid = minLat + ((maxLat - minLat) / 2);
    const longMid = minLong + ((maxLong - minLong) / 2);
    this.googleMapsService.panTo(latMid, longMid);
  }

  onClearPolygon(polygon: Polygon){
    const polyIndex = polygon.index;
    this.polygonChanged.emit();
    this.googleMapsService.deletePolygon(polyIndex);
    this.paddockService.deletePolygon(polygon.polygonApiId)
      .subscribe(res => {
        this.polygonEntityService.removeOneFromCache(polygon);
        this.polygonEntityService.delete(polygon.name);
      })
  }
}
