import { AngularFirestore } from '@angular/fire/firestore';
import { Polygon } from './../models/polygon.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private loader: Loader;
  map: google.maps.Map;
  drawingTools: google.maps.drawing.DrawingManager;
  private polygons: Polygon[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private fireStore: AngularFirestore
  ) {}

  private initLoader(){
    this.loader = new Loader({
      apiKey: environment.googleMaps,
      libraries: ['drawing', 'places']
    });
  }

  private initDrawingTools(){
    this.drawingTools = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
        ],
      },
      polygonOptions: {editable:false,fillColor:'#ff0000',strokeColor:'#ff0000',strokeWeight:2}
    });
  }

  setPolygonListener(){
    google.maps.event.addListener(this.drawingTools,'polygoncomplete',(polygon) => {
      const haLimit = 40000000000;
      const polyAreaHa = google.maps.geometry.spherical.computeArea(polygon.getPath()) / 10000;

      if (polyAreaHa > haLimit){
        polygon.setMap(null);
        this.snackBar.open(`Error: polygon must be less than or equal to polygon Ha limit: ${haLimit} Ha`, null, {
          duration: 6000
        })
      } else{
        const userId = JSON.parse(localStorage.getItem('user'))['id'];
        var coords = this.convertMvcToArray(polygon.getPath());
        const newPoly:Polygon = {
          index: 1,
          userId: userId,
          name: userId + '1',
          lat: coords[0],
          long: coords[1]
        }

        this.polygons.push(newPoly);
        this.pushPolygonToDb(newPoly);
      }
    });
  }

  initMap(targetElementMap: HTMLElement, targetElementSearchBox: HTMLInputElement){
    this.initLoader();
    this.loader.load().then(() => {
    this.map = new google.maps.Map(targetElementMap, {
        center: {lat: -25.861078, lng: 134.598730},
        zoom: 5,
    });

    const searchBox = new google.maps.places.SearchBox(targetElementSearchBox);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(targetElementSearchBox);
    // Bias the SearchBox results towards current map's viewport.
    this.map.addListener("bounds_changed", () => {
      searchBox.setBounds(this.map.getBounds() as google.maps.LatLngBounds);
    });

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });

      this.initDrawingTools();
      this.drawingTools.setMap(this.map);
      this.setPolygonListener();
    })
  }

  panTo(ltLng: google.maps.LatLng){
    this.map.panTo(ltLng);
  }

  convertMvcToArray(pathArray) {
    var lat: number[] = [];
    var long: number[] = [];
    for (var a = 0; a < pathArray.length; a++){
      lat.push(pathArray.getAt(a).lat());
      long.push(pathArray.getAt(a).lng());
    }

    return [lat, long];
  }

  pushPolygonToDb(polygon: Polygon) {
    this.fireStore.collection('userPolygons').doc(polygon.userId).collection('polygons').doc(polygon.name).set(polygon);
  }

}
