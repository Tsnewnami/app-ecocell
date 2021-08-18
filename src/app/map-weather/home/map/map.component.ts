import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let loader = new Loader({
      apiKey: 'AIzaSyDiA3LROOuEYVqF13dJNuLzBulxyy8d5Dc',
    })

    loader.load().then(() => {
      new google.maps.Map(document.getElementById("map"), {
        center: {lat: 50, lng: 6},
        zoom: 6,
      })
    })
  }

}
