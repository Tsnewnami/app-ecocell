import { HomeComponent } from './home/home.component';

import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { MapComponent } from './home/map/map.component';

@NgModule({
  imports: [
      CommonModule,
  ],
  declarations: [HomeComponent, MapComponent],
  exports: [HomeComponent]
})

export class MapWeatherModule {
  static forRoot(): ModuleWithProviders<MapWeatherModule> {
      return {
          ngModule: MapWeatherModule,
          providers: [
          ]
      }
  }
}
