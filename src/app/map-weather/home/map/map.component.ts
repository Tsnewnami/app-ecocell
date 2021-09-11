import { Observable } from 'rxjs';
import { PolygonEntityService } from './../../services/polygon-entity.service';
import { GoogleMapsPolygonService } from './../../services/google-maps-polygon.service';
import { GoogleMapsService } from '../../services/google-maps.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Polygon } from '../../models/polygon.model';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('map', {read: ElementRef, static: true}) mapElement: ElementRef<HTMLElement>;
  @ViewChild('pacinput', {read: ElementRef, static: true}) searchBoxElement: ElementRef<HTMLInputElement>;
  polygons$: Observable<Polygon[]>;
  private polygons: Polygon[]
  panelOpenState = false;
  polygonButtonsEnabled = false;
  drawState = false;
  initialLoad = true;
  opened = false;
  showFiller = false;


  constructor(
    private googleMapsService: GoogleMapsService,
    private googleMapsPolygonService: GoogleMapsPolygonService,
    private polygonEntityService: PolygonEntityService
  ) { }

  ngOnInit(){
    this.polygons$ = this.polygonEntityService.entities$
    this.polygons$
      .subscribe(polygons => {
        this.polygons = polygons as Polygon[];
      })
    console.log(this.polygons);
    this.googleMapsService.initMap(this.mapElement.nativeElement, this.searchBoxElement.nativeElement, this.polygons);
  }

  setCropType(event) {
    if(!this.polygonButtonsEnabled){
      this.polygonButtonsEnabled = true;
      this.googleMapsService.setDrawingTools();
    }


    this.googleMapsService.setCurrentCropType(event.value)
  }

  drawPolygon() {
    if (this.initialLoad) {
      this.googleMapsService.setDrawingTools();
      this.initialLoad = false;
    }

    this.googleMapsPolygonService.initPolygonEvent();
    this.drawState = !this.drawState
  }

  finishPolygon() {
    this.googleMapsPolygonService.stopPolygonEvent();
    this.drawState = !this.drawState
  }

  onOpenAccordion(panel: MatExpansionPanel) {
    panel.open();
  }

  onCloseAccordion(panel: MatExpansionPanel) {
    panel.close();
  }

  toggleSideBar() {
    this.opened = !this.opened;
  }

}
