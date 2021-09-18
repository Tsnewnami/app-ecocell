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

    this.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(
      () =>
      this.auth.signInWithEmailAndPassword(
        email,
        password
      ).then(result => {
        this.isLoading.next(true);
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
        this.snackBar.open(this.parseError(err.code), null, {duration :6000});
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
      this.snackBar.open(this.parseError(err.code), null, {duration :6000});
    })
  }

  logout() {
    return this.auth.signOut()
      .then(res => {
        console.log(res);
        localStorage.removeItem('user');
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.log(err);
      })
  }

  resetPasswordInit(email: string) {
    return this.auth.sendPasswordResetEmail(
      email,
      { url: 'https://app-ecocell.web.app/' });
  }

  parseError(errorCode: string): string {

    let message: string;

    switch (errorCode) {
      case 'auth/wrong-password':
        message = 'Invalid login credentials.';
        break;
      case 'auth/network-request-failed':
        message = 'Please check your internet connection';
        break;
      case 'auth/too-many-requests':
        message =
          'We have detected too many requests from your device. Take a break please!';
        break;
      case 'auth/user-disabled':
        message =
          'Your account has been disabled or deleted. Please contact the system administrator.';
        break;
      case 'auth/requires-recent-login':
        message = 'Please login again and try again!';
        break;
      case 'auth/email-already-exists':
        message = 'Email address is already in use by an existing user.';
        break;
      case 'auth/user-not-found':
        message =
          'We could not find user account associated with the email address or phone number.';
        break;
      case 'auth/phone-number-already-exists':
        message = 'The phone number is already in use by an existing user.';
        break;
      case 'auth/invalid-phone-number':
        message = 'The phone number is not a valid phone number!';
        break;
      case 'auth/invalid-email  ':
        message = 'The email address is not a valid email address!';
        break;
      case 'auth/cannot-delete-own-user-account':
        message = 'You cannot delete your own user account.';
        break;
       default:
        message = 'Oops! Something went wrong. Try again later.';
        break;
    }

    return message;
  }

}
