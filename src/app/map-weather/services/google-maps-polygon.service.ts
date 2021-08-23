import { GoogleMapsService } from './google-maps.service';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsPolygonService {
  listener;

  constructor(
    private googleMapsService: GoogleMapsService
    ){}

    initPolygonEvent() {
      this.googleMapsService.drawingTools.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }

    stopPolygonEvent() {
      this.googleMapsService.drawingTools.setDrawingMode(null);
    }

    setPolygonColourOptions(fillColourHex: string, strokeColorHex: string) {
      this.googleMapsService.drawingTools.setOptions({
        polygonOptions: {editable:false,fillColor:'#00ffff',strokeColor:'#ff0000',strokeWeight:2}
      });
    }

}
