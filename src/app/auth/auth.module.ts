
import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {AuthService} from "./auth.service";
import {AuthGuard} from './auth.guard';
import {HomepageComponent} from './homepage/homepage.component';
import {LoginComponent} from './login/login.component';
import {HeaderComponent} from './header/header.component';
import {SignupComponent} from './signup/signup.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatToolbarModule} from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      MatCardModule,
      MatInputModule,
      MatButtonModule,
      RouterModule.forChild([{path: '', component: HomepageComponent}]),
      MatTabsModule,
      MatFormFieldModule,
      MatToolbarModule,
      FlexLayoutModule
  ],
  declarations: [HomepageComponent, HeaderComponent, LoginComponent, SignupComponent],
  exports: [HomepageComponent, HeaderComponent, LoginComponent, SignupComponent]
})

export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
      return {
          ngModule: AuthModule,
          providers: [
            AuthService,
            AuthGuard
          ]
      }
  }
}
