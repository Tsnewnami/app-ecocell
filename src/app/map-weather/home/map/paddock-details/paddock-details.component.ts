import { Component, Input, OnInit } from '@angular/core';
import { Polygon } from 'src/app/map-weather/models/polygon.model';

@Component({
  selector: 'app-paddock-details',
  templateUrl: './paddock-details.component.html',
  styleUrls: ['./paddock-details.component.css']
})
export class PaddockDetailsComponent implements OnInit {
  @Input()
  polygon: Polygon;

  constructor() { }

  ngOnInit(): void {
  }

}
