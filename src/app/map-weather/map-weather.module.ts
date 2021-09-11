import { FarmGuard } from './services/farm.guard';
import { FarmsResolver } from './services/farms.resolver';
import { FarmDataService } from './services/farm-data.service';
import { FarmEntityService } from './services/farm-entity.service';
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
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PolygonListComponent } from './home/map/polygon-list/polygon-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { PaddockDetailsComponent } from './home/map/paddock-details/paddock-details.component';
import { comparePaddock, Paddock } from './models/paddock.model';
import { PaddockEntityService } from './services/paddock-entity.service';
import { PaddockApiService } from './services/paddock-api.service';
import { CreateFarmComponent } from './create-farm/create-farm.component';
import { FarmDialogComponent } from './create-farm/farm-dialog/farm-dialog.component';
import { compareFarms, Farm } from './models/farm.model';
import { MapHomeComponent } from './home/map-home/map-home.component';

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
  },
  Farm : {
    sortComparer: compareFarms,
    selectId: (farm: Farm) => farm.index
  }

};

export const mapWeatherRoutes: Routes = [
  {
    path: 'app',
    component: HomeComponent,
    canActivate: [AuthGuard],
    resolve: {
      farms: FarmsResolver
    }
  },
  {
    path: 'app/:farm',
    component: MapHomeComponent,
    canActivate: [FarmGuard],
    resolve: {
      farms: PolygonsResolver
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
      MatInputModule,
      MatCardModule,
      FlexLayoutModule,
      MatToolbarModule,
      MatTabsModule,
      MatExpansionModule
  ],
  declarations: [HomeComponent,
     MapComponent,
     PolygonListComponent,
     PaddockDetailsComponent,
     CompletePolygonComponent,
     CreateFarmComponent,
     FarmDialogComponent,
     MapHomeComponent],
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
            FarmEntityService,
            FarmDataService,
            FarmsResolver,
            FarmGuard
          ]
      }
  }

  constructor(
    private eds: EntityDefinitionService,
    private entityDataService: EntityDataService,
    private polygonDataService: PolygonsDataService,
    private farmDataService: FarmDataService) {
    eds.registerMetadataMap(entityMetaData);
    entityDataService.registerService('Polygon', polygonDataService)
    entityDataService.registerService('Paddock', polygonDataService)
    entityDataService.registerService('Farm', farmDataService)
  }
}
