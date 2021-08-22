import { GoogleMapsService } from '../../services/google-maps.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('map', {read: ElementRef, static: true}) mapElement: ElementRef<HTMLElement>;

  map: google.maps.Map
  drawingTools: google.maps.drawing.DrawingManager

  constructor(
    private googleMapsService: GoogleMapsService
  ) { }

  ngOnInit(): void {
    // this.googleMapsService.initLoader(this.mapElement as HTMLElement)


    //   this.drawingTools = this.googleMapsService.initDrawingTools();
    //   this.drawingTools.setMap(this.map);
    //   this.googleMapsService.setMap(this.map)
    //   this.googleMapsService.setDrawingTools(this.drawingTools);
    //   this.googleMapsService.setEventListeners();
    //   this.googleMapsService.panTo(new google.maps.LatLng(-34, 151));

    // })

  }

  ngAfterViewInit(): void {
    this.googleMapsService.initMap(this.mapElement.nativeElement)
  }

}
