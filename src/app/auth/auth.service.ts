import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from "@ngrx/store";
import { login } from './auth.actions';
import { User } from './model/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthState } from './reducers';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private store: Store<AuthState>,
    private snackBar: MatSnackBar) { }

  login(email: string, password: string){
    return this.auth.signInWithEmailAndPassword(
      email,
      password
    ).then(result => {
      const userAction: User = {id: result.user.uid, email: result.user.email}
      this.store.dispatch(login({user: userAction}))
    })
    .catch(err => {
      this.snackBar.open(err.message, null, {duration :6000});
    })

  }
}
