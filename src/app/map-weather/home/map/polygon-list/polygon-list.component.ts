import { GoogleMapsService } from './../../../services/google-maps.service';
import { Component, Input, OnInit } from '@angular/core';
import { Polygon } from 'src/app/map-weather/models/polygon.model';

@Component({
  selector: 'app-polygon-list',
  templateUrl: './polygon-list.component.html',
  styleUrls: ['./polygon-list.component.css']
})
export class PolygonListComponent implements OnInit {
  @Input()
  polygons: Polygon[];

  constructor(private googleMapsService: GoogleMapsService) { }

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

  onClearPolygon(index: number){
    console.log("hi")
    this.googleMapsService.deletePolygon(index);
  }
}
