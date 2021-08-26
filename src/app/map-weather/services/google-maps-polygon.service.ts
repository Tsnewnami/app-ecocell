import { Polygon } from './../models/polygon.model';
import { GoogleMapsService } from './google-maps.service';
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})
export class GoogleMapsPolygonService {

  constructor(
    private googleMapsService: GoogleMapsService,
    ){}

    initPolygonEvent() {
      this.googleMapsService.drawingTools.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }

    stopPolygonEvent() {
      this.googleMapsService.drawingTools.setDrawingMode(null);
    }

    setPolygonColourOptions(fillColourHex: string) {
      this.googleMapsService.drawingTools.setOptions({
        polygonOptions: {editable:false,fillColor:fillColourHex, strokeColor:'#000000',strokeWeight:2}
      });
    }


}
