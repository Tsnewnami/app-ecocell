import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { MapWeatherModule } from './map-weather/map-weather.module';
import { AngularFireModule } from '@angular/fire';
import { EffectsModule } from '@ngrx/effects';
import { EntityDataModule } from '@ngrx/data';
import { HttpClientModule } from '@angular/common/http';
import { PolygonsResolver } from './map-weather/services/polygons.resolver';

const routes: Routes = [
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule.forRoot(),
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    MapWeatherModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot({}),
  ],
  providers: [PolygonsResolver],
  bootstrap: [AppComponent]
})
export class AppModule { }
