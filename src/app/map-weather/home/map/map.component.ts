import { GoogleMapsPolygonService } from './../../services/google-maps-polygon.service';
import { GoogleMapsService } from '../../services/google-maps.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('map', {read: ElementRef, static: true}) mapElement: ElementRef<HTMLElement>;
  @ViewChild('pacinput', {read: ElementRef, static: true}) searchBoxElement: ElementRef<HTMLInputElement>;
  constructor(
    private googleMapsService: GoogleMapsService,
    private googleMapsPolygonService: GoogleMapsPolygonService
  ) { }

  ngOnInit(){
    this.googleMapsService.initMap(this.mapElement.nativeElement, this.searchBoxElement.nativeElement);
    this.googleMapsService.polygonAvailableCheck()
        .subscribe(loaded => {
          if (loaded) {
            console.log('Attempting to load polygon data');
            this.googleMapsService.fetchAllAvailablePolygonsForUser(true);
          } else {
            return;
          }
        })

  }

  drawPolygon() {
    this.googleMapsPolygonService.initPolygonEvent();
  }

  finishPolygon() {
    this.googleMapsPolygonService.stopPolygonEvent();
  }
}
