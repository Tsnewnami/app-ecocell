import { PolygonEntityService } from './../services/polygon-entity.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Polygon } from '../models/polygon.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  selectedPolygon: Polygon
  polygons$: Observable<Polygon[]>;

  constructor(private polygonEntityService: PolygonEntityService) { }

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.polygons$ = this.polygonEntityService.entities$
  }

}
