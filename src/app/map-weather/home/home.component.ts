import { PolygonEntityService } from './../services/polygon-entity.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Polygon } from '../models/polygon.model';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  selectedPolygon: Polygon
  polygons$: Observable<Polygon[]>;
  farmName: string

  constructor(
    private polygonEntityService: PolygonEntityService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.reload();
    this.route.url.subscribe(res => this.farmName = res[1].path);
  }

  reload() {
    this.polygons$ = this.polygonEntityService.entities$
  }

}
