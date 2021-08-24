import { GoogleMapsService } from '../map-weather/services/google-maps.service';
import { HomeComponent } from './home/home.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MapComponent } from './home/map/map.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      MatSnackBarModule,
      AngularFirestoreModule
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

          ]
      }
  }
}
