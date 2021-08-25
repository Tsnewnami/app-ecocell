import { PolygonEntityService } from './services/polygon-entity.service';
import { EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { GoogleMapsService } from '../map-weather/services/google-maps.service';
import { HomeComponent } from './home/home.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MapComponent } from './home/map/map.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { PolygonsResolver } from './services/polygons.resolver';
import { PolygonsDataService } from './services/polygons-data.service';
import { comparePolygons, Polygon } from './models/polygon.model';


const entityMetaData :EntityMetadataMap = {
  Polygon: {
    sortComparer: comparePolygons,
    selectId: (polygon: Polygon) => polygon.index
  },
  Event: {
  }
};

export const mapWeatherRoutes: Routes = [
  {
    path: 'app',
    component: HomeComponent,
    canActivate: [AuthGuard],
    resolve: {
      polygons: PolygonsResolver
    }
  },
];

@NgModule({
  imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      MatSnackBarModule,
      AngularFirestoreModule,
      RouterModule.forChild(mapWeatherRoutes)
  ],
  declarations: [HomeComponent, MapComponent],
  exports: [HomeComponent]
})

export class MapWeatherModule {
  static forRoot(): ModuleWithProviders<MapWeatherModule> {
      return {
          ngModule: MapWeatherModule,
          providers: [
            GoogleMapsService,
            PolygonEntityService,
            PolygonsResolver,
            PolygonsDataService
          ]
      }
  }

  constructor(
    private eds: EntityDefinitionService,
    private entityDataService: EntityDataService,
    private polygonDataService: PolygonsDataService) {
    eds.registerMetadataMap(entityMetaData);
    entityDataService.registerService('Polygon', polygonDataService)
  }
}
