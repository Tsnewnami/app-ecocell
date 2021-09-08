
import { ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from "./auth.service";
import { AuthGuard } from './auth.guard';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './signup/signup.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule} from "@angular/material/form-field"
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects'
import { AuthEffects } from './auth.effect';;
import * as fromAuth from './reducers';
import { EmailVerificationComponent } from './email-verification/email-verification.component';

@NgModule({
  imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      MatCardModule,
      MatInputModule,
      MatButtonModule,
      MatSnackBarModule,
      MatDialogModule,
      MatIconModule,
      RouterModule.forChild([
        {path: '', component: LoginComponent},
        {path: 'signup', component: SignupComponent}
      ]),
      MatTabsModule,
      MatFormFieldModule,
      MatToolbarModule,
      MatProgressSpinnerModule,
      FlexLayoutModule,
      StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.authReduder),
      EffectsModule.forFeature([AuthEffects]),

  ],
  declarations: [HomepageComponent, HeaderComponent, LoginComponent, SignupComponent, EmailVerificationComponent],
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
