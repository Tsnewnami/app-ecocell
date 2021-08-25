import { AngularFirestore } from '@angular/fire/firestore';
import { Polygon } from './../models/polygon.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private loader: Loader;
  map: google.maps.Map;
  drawingTools: google.maps.drawing.DrawingManager;
  private polygons: Polygon[] = [];
  polygonsChanged = new Subject<Polygon[]>();

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
        var index = this.polygons.length;
        const newPoly:Polygon = {
          index: index,
          userId: userId,
          name: 'Corn' + index.toString(),
          lat: coords[0],
          long: coords[1]
        }


        this.polygons.push(newPoly);
        this.polygonsChanged.next([...this.polygons]);
        this.pushPolygonToDb(newPoly);
      }
    });
  }

  initMap(targetElementMap: HTMLElement, targetElementSearchBox: HTMLInputElement, polygons: Polygon[]){
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
      this.polygons = polygons;
      this.polygons.forEach(polygon => {
        this.createPolygon(polygon);
      })
    })
  }

  panTo(ltLng: google.maps.LatLng){
    this.map.panTo(ltLng);
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

  polygonAvailableCheck(): Observable<boolean> {
    var loaded = new Subject<boolean>();
    const userId = JSON.parse(localStorage.getItem('user'))['id'];
    this.fireStore.collection('userPolygons').doc(userId).collection('polygons')
      .get()
      .subscribe((docData) => {
        if (!docData.empty) {
          console.log("Polygon data available");
          loaded.next(true);
        } else {
          console.log("Polygon data not available");
          loaded.next(false);
      }
    }, error =>{
      console.log(error);
    });

    return loaded.asObservable();
  }

 fetchAllAvailablePolygonsForUser(freshLogin?: boolean) {
    const userId = JSON.parse(localStorage.getItem('user'))['id'];
    this.fireStore.collection('userPolygons').doc(userId).collection('polygons')
    .snapshotChanges()
    .pipe(map( docArray => {
      return docArray.map( doc => {
        return(
           {
            index: doc.payload.doc.data()['index'],
            userId: doc.payload.doc.data()['userId'],
            name: doc.payload.doc.data()['name'],
            lat: doc.payload.doc.data()['lat'],
            long: doc.payload.doc.data()['long'],
         }
      );
      });
    }))
    .subscribe((polygonsDb: Polygon[]) => {
      if (freshLogin){
        polygonsDb.forEach((polygon) => this.createPolygon(polygon));
      }
      this.polygons = polygonsDb;
      this.polygonsChanged.next([...this.polygons]);
    }, error => {
      this.snackBar.open(`Failed to fetch polygons. Please try again later.`, null, {
        duration: 6000
      })
    })
  }

  pushPolygonToDb(polygon: Polygon) {
    this.fireStore.collection('userPolygons').doc(polygon.userId).collection('polygons').doc(polygon.name).set(polygon);
  }

  createPolygon(polygon: Polygon) {
    var paths = []
    for (let i = 0; i < polygon.lat.length; i++) {
      const gData = new google.maps.LatLng(polygon.lat[i], polygon.long[i]);
      paths.push(gData);
    }

    const poly = new google.maps.Polygon({
      paths: paths,
      strokeColor: "#fcba03",
      strokeOpacity: 0.8,
      strokeWeight: 3,
      fillColor: "#FF0000",
      fillOpacity: 0.35
    })

    poly.setMap(this.map)
  }

}
