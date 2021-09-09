import { FarmService } from './farm.service';
import { CompletePolygonComponent } from './../home/map/complete-polygon/complete-polygon.component';
import { Paddock } from './../models/paddock.model';
import { PaddockEntityService } from './paddock-entity.service';
import { PaddockApiService } from './paddock-api.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Polygon, RenderedPolygon } from './../models/polygon.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { CropType } from '../models/croptype.enum';
import { MatDialog } from '@angular/material/dialog';
import { style } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
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
    private paddockEntityService: PaddockEntityService,
    private dialog: MatDialog,
    private farmService: FarmService,
  ) {}

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

  setInfoWindowListener() {
    google.maps.event.addListener(this.map, 'click', function(event) {
      console.log(event)
      // this.infowindow.setContent("this is an infowindow<br>on letter " + event.feature.getProperty('letter'));
      // this.infowindow.setPosition(event.latLng);
      // this.infowindow.open(map);
    });
  }

  setPolygonListener(){
    google.maps.event.addListener(this.drawingTools,'polygoncomplete',(polygon: google.maps.Polygon) => {
      const haLimit = 40000000000;
      const polyAreaHa = google.maps.geometry.spherical.computeArea(polygon.getPath()) / 10000;

      if (polyAreaHa > haLimit){
        polygon.setMap(null);
        this.snackBar.open(`Error: polygon must be less than or equal to polygon Ha limit: ${haLimit} Ha`, null, {
          duration: 6000
        })
      } else{
        const dialogRef = this.dialog.open(CompletePolygonComponent, {
        });

        var polyName: string;
        var polyOptions: google.maps.PolygonOptions;
        dialogRef.afterClosed().subscribe(async result => {
          if (result) {
            polyName = result[0].trim();
            polyOptions = this.setCurrentCropType(result[1]);
            polygon.setOptions(polyOptions);

            const userId = JSON.parse(localStorage.getItem('user'))['id'];
            var coords = this.convertMvcToArray(polygon.getPath());
            const index = Math.round(new Date().getTime() / 1000);
            const name = polyName;

            this.renderedPolygons.push({
              index: index,
              polygon: polygon
            });

            this.pushPolygonToDb(index, userId, name , coords[0], coords[1], polyOptions.fillColor, polyAreaHa);
          } else{
            polygon.setMap(null);
            return;
          }
        });
      }
    });
  }

  initMap(targetElementMap: HTMLElement, targetElementSearchBox: HTMLInputElement, polygons?: Polygon[]){
    this.map = new google.maps.Map(targetElementMap, {
        center: {lat: -25.861078, lng: 134.598730},
        zoom: 5,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.SATELLITE
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
      this.setInfoWindowListener();
      this.drawingTools.setOptions({drawingControl:false});
      if(polygons) {
        polygons.forEach(polygon => {
          this.createPolygon(polygon, polygon.index);
        })
      }
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

    this.paddockSerivce.getPaddockData("test", index, lat[0], long[0], 1, 1, 1, 1, 1)
        .subscribe((res: Paddock) => this.paddockEntityService.addOneToCache(res));
    this.fireStore.collection('Users')
                  .doc(userId)
                  .collection('Farms')
                  .doc(this.farmService.getCurrentFarm().name)
                  .collection('Polygons')
                  .doc(polygon.name)
                  .set(polygon);
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

    this.paddockSerivce.getPaddockData("test", index, polygon.lat[0], polygon.long[0], 1, 1, 1, 1, 1)
            .subscribe((res: Paddock) => this.paddockEntityService.addOneToCache(res));
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
    var polyOptions;
    const cropTypeLower = cropType.toLowerCase();
    switch(cropTypeLower) {
      case "corn": {
        this.currentCropType = CropType.Corn;
        polyOptions = {editable:false,fillColor:"#dbdb07", strokeColor:'#000000',strokeWeight:2};
        this.drawingTools.setOptions({
          polygonOptions: polyOptions
        });
        this.currentCropColor = "#dbdb07";
        break;
      }
      case "wheat": {
        this.currentCropType = CropType.Wheat;
        polyOptions = {editable:false,fillColor:"#00ba1f", strokeColor:'#000000',strokeWeight:2};
        this.drawingTools.setOptions({
          polygonOptions: polyOptions
        });
        this.currentCropColor = "#00ba1f";
        break;
      }
      case "sorghum": {
        console.log("Setting to sorghum");
        this.currentCropType = CropType.Sorghum;
        polyOptions = {editable:false,fillColor:"#00457d", strokeColor:'#000000',strokeWeight:2};
        this.drawingTools.setOptions({
          polygonOptions: polyOptions
        });
        this.currentCropColor = "#00457d";
        break;
      }
      case "barley": {
        this.currentCropType = CropType.Barley;
        polyOptions = {editable:false,fillColor:"#680b8c", strokeColor:'#000000',strokeWeight:2};
        this.drawingTools.setOptions({
          polygonOptions: polyOptions
        });
        this.currentCropColor = "#680b8c";
        break;
      }
      default: {
        break;
      }
    }

    return polyOptions;
  }

}
