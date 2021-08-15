import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { login } from './auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecocell-appli';

  constructor(
    private store: Store,
    )
    {}

  ngOnInit() {
    const userProfile = localStorage.getItem('user');

    if (userProfile) {
      this.store.dispatch(login({user : JSON.parse(userProfile)}))
    }
  }
}
