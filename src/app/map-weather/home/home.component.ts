import { PaddockEntityService } from './../services/paddock-entity.service';
import { FarmService } from './../services/farm.service';
import { PolygonEntityService } from './../services/polygon-entity.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {

  constructor(
    private farmService: FarmService,
    private paddockEntityService: PaddockEntityService,
    private polygonEntitiyService: PolygonEntityService
  ) { }

  ngOnInit(): void {
  }

  onNavigateHome() {
    this.farmService.setCurrentFarm(null);
    this.paddockEntityService.clearCache();
    this.polygonEntitiyService.clearCache();
  }

}
