import { HomeComponent } from './home/home.component';

import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
      CommonModule,
  ],
  declarations: [HomeComponent],
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
