import { PaddockApiService } from './paddock-api.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Polygon, RenderedPolygon } from './../models/polygon.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { CropType } from '../models/croptype.enum';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private loader: Loader;
  private currentCropType: CropType;
  private currentCropColor: string;
  private renderedPolygons: RenderedPolygon[] = []

  map: google.maps.Map;
  drawingTools: google.maps.drawing.DrawingManager;
  polygonsChanged = new Subject<Polygon[]>();

  constructor(
    private snackBar: MatSnackBar,
    private fireStore: AngularFirestore,
    private paddockSerivce: PaddockApiService,
  ) {}

  private initLoader(){
    this.loader = new Loader({
      apiKey: environment.googleMaps,
      libraries: ['drawing', 'places']
    });
  }

  initDrawingTools(){
    if (this.drawingTools != null) {
      this.drawingTools.setMap(null);
    }

    this.drawingTools = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: [
          google.maps.drawing.OverlayType.POLYGON,
        ],
      },
      polygonOptions: {editable:false,fillColor:'#ff0000',strokeColor:'#ff0000',strokeWeight:2}
    });

    this.drawingTools.setMap(this.map);
    this.drawingTools.setOptions({drawingControl:false});
  }

  setDrawingTools() {
    this.drawingTools.setMap(this.map);
  }

  setCancelDrawingListener() {
    google.maps.event.addListener(this.map, 'rightclick', () => {
      this.initDrawingTools();
      this.setPolygonListener();
      this.setCurrentCropType(this.currentCropType);
    })
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
        const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        const index = Math.round(new Date().getTime() / 1000);
        const name = this.currentCropType + " ID: " + genRanHex(4);

        this.renderedPolygons.push({
          index: index,
          polygon: polygon
        });
        this.pushPolygonToDb(index, userId, name , coords[0], coords[1], this.currentCropColor, polyAreaHa);
      }
    });
  }

  initMap(targetElementMap: HTMLElement, targetElementSearchBox: HTMLInputElement, polygons?: Polygon[]){
    this.initLoader();
    this.loader.load().then(() => {
    this.map = new google.maps.Map(targetElementMap, {
        center: {lat: -25.861078, lng: 134.598730},
        zoom: 5,
        streetViewControl: false,
    });

    const searchBox = new google.maps.places.SearchBox(targetElementSearchBox);
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(targetElementSearchBox);
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
      // this.drawingTools.setMap(this.map);
      this.setPolygonListener();
      this.setCancelDrawingListener();
      this.drawingTools.setOptions({drawingControl:false});
      if(polygons) {
        polygons.forEach(polygon => {
          this.createPolygon(polygon, polygon.index);
        })
      }
    })
  }

  panTo(lat: number, long: number){
    const ltLng = new google.maps.LatLng(lat, long);
    this.map.panTo(ltLng);
    this.map.setZoom(15);
  }

  private convertMvcToArray(pathArray) {
    var lat: number[] = [];
    var long: number[] = [];
    for (var a = 0; a < pathArray.length; a++){
      lat.push(pathArray.getAt(a).lat());
      long.push(pathArray.getAt(a).lng());
    }

    return [lat, long];
  }

  pushPolygonToDb(index: number, userId: string, name: string, lat: number[], long: number[], fillColor: string, polyArea: number) {
    // this.paddockSerivce.createPolygon(name, long, lat)
    //     .subscribe(res => {
    //       const polygon: Polygon = {
    //         index: index,
    //         userId: userId,
    //         name: name,
    //         lat: lat,
    //         long: long,
    //         fillColor: fillColor,
    //         // polygonApiId: res.toString(),
    //         polygonApiId: "TEST"
    //       }

    //       this.fireStore.collection('userPolygons').doc(userId).collection('polygons').doc(name).set(polygon);
    //     })

        const polygon: Polygon = {
          index: index,
          userId: userId,
          name: name,
          lat: lat,
          long: long,
          fillColor: fillColor,
          // polygonApiId: res.toString(),
          polygonApiId: "TEST",
          polyArea: polyArea
        }

        this.fireStore.collection('userPolygons').doc(userId).collection('polygons').doc(name).set(polygon);
  }

  createPolygon(polygon: Polygon, index: number) {
    var paths = []
    for (let i = 0; i < polygon.lat.length; i++) {
      const gData = new google.maps.LatLng(polygon.lat[i], polygon.long[i]);
      paths.push(gData);
    }

    const poly = new google.maps.Polygon({
      paths: paths,
      strokeColor: "#000000",
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: polygon.fillColor,
      fillOpacity: 0.35
    })

    poly.setMap(this.map)

    this.renderedPolygons.push({
      index: index,
      polygon: poly
    });
  }

  deletePolygon(index: number){
   for (let i = 0; i < this.renderedPolygons.length; i++) {
     if(this.renderedPolygons[i].index == index) {
        this.renderedPolygons[i].polygon.setMap(null);
        this.renderedPolygons[i] = null;
        this.renderedPolygons.splice(i, 1);
     }
   }
  }

  setCurrentCropType(cropType: string){
    const cropTypeLower = cropType.toLowerCase();
    switch(cropTypeLower) {
      case "corn": {
        this.currentCropType = CropType.Corn;
        this.drawingTools.setOptions({
          polygonOptions: {editable:false,fillColor:"#dbdb07", strokeColor:'#000000',strokeWeight:2}
        });
        this.currentCropColor = "#dbdb07";
        break;
      }
      case "wheat": {
        this.currentCropType = CropType.Wheat;
        this.drawingTools.setOptions({
          polygonOptions: {editable:false,fillColor:"#00ba1f", strokeColor:'#000000',strokeWeight:2}
        });
        this.currentCropColor = "#00ba1f";
        break;
      }
      case "sorghum": {
        console.log("Setting to sorghum");
        this.currentCropType = CropType.Sorghum;
        this.drawingTools.setOptions({
          polygonOptions: {editable:false,fillColor:"#00457d", strokeColor:'#000000',strokeWeight:2}
        });
        this.currentCropColor = "#00457d";
        break;
      }
      case "barley": {
        this.currentCropType = CropType.Barley;
        this.drawingTools.setOptions({
          polygonOptions: {editable:false,fillColor:"#680b8c", strokeColor:'#000000',strokeWeight:2}
        });
        this.currentCropColor = "#680b8c";
        break;
      }
      default: {
        break;
      }
    }
  }

}
