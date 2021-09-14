import { FarmService } from './../../services/farm.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Polygon } from '../../models/polygon.model';
import { PolygonEntityService } from '../../services/polygon-entity.service';
import { PaddockEntityService } from '../../services/paddock-entity.service';

@Component({
  selector: 'app-map-home',
  templateUrl: './map-home.component.html',
  styleUrls: ['./map-home.component.css']
})
export class MapHomeComponent implements OnInit {
  selectedPolygon: Polygon
  polygons$: Observable<Polygon[]>;
  farmName: string

  constructor(
    private polygonEntityService: PolygonEntityService,
    private route: ActivatedRoute,
    private farmService: FarmService,
    private paddockEntityService: PaddockEntityService,
    private polygonEntitiyService: PolygonEntityService) { }

  ngOnInit(): void {
    this.reload();
    this.route.url.subscribe(res => this.farmName = res[1].path);
    this.farmName = this.farmService.getCurrentFarm().name;
  }

  reload() {
    this.polygons$ = this.polygonEntityService.entities$
  }

  onNavigateHome() {
    this.farmService.setCurrentFarm(null);
    this.paddockEntityService.clearCache();
    this.polygonEntitiyService.clearCache();
  }

}
