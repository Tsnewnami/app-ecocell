import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from "@ngrx/store";
import { login } from './auth.actions';
import { User } from './model/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthState } from './reducers';
import { MatDialog } from '@angular/material/dialog';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import  firebase  from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoading = new BehaviorSubject<boolean>(false);

  constructor(
    private auth: AngularFireAuth,
    private store: Store<AuthState>,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router) {

    }

  async login(email: string, password: string){
    this.isLoading.next(true);
    this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(
      () =>
      this.auth.signInWithEmailAndPassword(
        email,
        password
      ).then(result => {

        const userAction: User = {id: result.user.uid, email: result.user.email}

        if(!result.user.emailVerified)
        {
          this.snackBar.open(`Error: Please verify your email address ${result.user.email}`, null, {duration :6000});
          return;
        }

        this.store.dispatch(login({user: userAction}));
        this.isLoading.next(false);
        this.router.navigate(['/app']);
      })
      .catch(err => {
        this.snackBar.open(err.message, null, {duration :6000});
      })
    );
  }

  signup(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(
      email,
      password
    ).then(result => {
      result.user.sendEmailVerification()
      this.dialog.open(EmailVerificationComponent, {
        height: '250px',
        width: '300px',
      })
    })
    .catch(err => {
      this.snackBar.open(err.message, null, {duration :6000});
    })
  }

}
