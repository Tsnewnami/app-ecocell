import { PolygonEntityService } from './../services/polygon-entity.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Polygon } from '../models/polygon.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  polygons$: Observable<Polygon[]>;

  constructor(private polygonEntityService: PolygonEntityService) { }

  ngOnInit(): void {
    this.polygons$ = this.polygonEntityService.entities$
  }

}
