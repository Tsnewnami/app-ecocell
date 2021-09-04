import { CompletePolygonComponent } from './home/map/complete-polygon/complete-polygon.component';
import { PolygonEntityService } from './services/polygon-entity.service';
import { CommonModule } from '@angular/common';
import { EntityDataService, EntityDefinitionService, EntityMetadataMap } from '@ngrx/data';
import { GoogleMapsService } from '../map-weather/services/google-maps.service';
import { HomeComponent } from './home/home.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ModuleWithProviders, NgModule} from '@angular/core';
import { MapComponent } from './home/map/map.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { PolygonsResolver } from './services/polygons.resolver';
import { PolygonsDataService } from './services/polygons-data.service';
import { comparePolygons, Polygon } from './models/polygon.model';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PolygonListComponent } from './home/map/polygon-list/polygon-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { PaddockDetailsComponent } from './home/map/paddock-details/paddock-details.component';
import { comparePaddock, Paddock } from './models/paddock.model';
import { PaddockEntityService } from './services/paddock-entity.service';
import { PaddockApiService } from './services/paddock-api.service';

const entityMetaData :EntityMetadataMap = {
  Polygon: {
    sortComparer: comparePolygons,
    selectId: (polygon: Polygon) => polygon.index
  },
  Event: {
  },
  Paddock: {
    sortComparer: comparePaddock,
    selectId: (paddock: Paddock) => paddock.index
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
      AngularFirestoreModule,
      RouterModule.forChild(mapWeatherRoutes),
      MatSidenavModule,
      MatButtonModule,
      MatListModule,
      MatFormFieldModule,
      MatSelectModule,
      MatIconModule,
      MatDialogModule,
      MatInputModule
  ],
  declarations: [HomeComponent,
     MapComponent,
     PolygonListComponent,
     PaddockDetailsComponent,
     CompletePolygonComponent],
  exports: [
    HomeComponent,
  ]
})

export class MapWeatherModule {
  static forRoot(): ModuleWithProviders<MapWeatherModule> {
      return {
          ngModule: MapWeatherModule,
          providers: [
            GoogleMapsService,
            PaddockApiService,
            PolygonEntityService,
            PolygonsResolver,
            PolygonsDataService,
            PaddockEntityService,
          ]
      }
  }

  constructor(
    private eds: EntityDefinitionService,
    private entityDataService: EntityDataService,
    private polygonDataService: PolygonsDataService) {
    eds.registerMetadataMap(entityMetaData);
    entityDataService.registerService('Polygon', polygonDataService)
    entityDataService.registerService('Paddock', polygonDataService)
  }
}
