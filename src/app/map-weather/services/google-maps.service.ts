import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private loader: Loader
  private map: google.maps.Map
  private drawingTools: google.maps.drawing.DrawingManager

  constructor() {

   }


  private initLoader(){
    this.loader = new Loader({
      apiKey: 'AIzaSyDiA3LROOuEYVqF13dJNuLzBulxyy8d5Dc',
      libraries: ['drawing', 'places']
    });
  }

  private initDrawingTools(){
    this.drawingTools = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
        ],
      },
      markerOptions: {
        icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      },
      circleOptions: {
        fillColor: "#ffff00",
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });
  }

  initMap(targetElement: HTMLElement){
    this.initLoader();
    this.loader.load().then(() => {
    this.map = new google.maps.Map(targetElement, {
        center: {lat: 50, lng: 6},
        zoom: 6,
      })

      this.initDrawingTools();
      this.drawingTools.setMap(this.map);
      this.setEventListeners();
    })
  }

  setEventListeners(){
    google.maps.event.addListener(this.drawingTools,'polygoncomplete',function(polygon) {
      var polygonBounds = polygon.getPath();
      for (var a = 0; a < polygonBounds.length; a++){
        console.log(polygonBounds.getAt(a).lat(), polygonBounds.getAt(a).lng());
      }
    });
  }

  panTo(ltLng: google.maps.LatLng){
    this.map.panTo(ltLng);
  }

}
