import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoadingSub:Subscription;
  loadingState = false;

  constructor(private authSerivce: AuthService) { }

  ngOnInit(): void {
    this.isLoadingSub = this.authSerivce.isLoading.subscribe(state => {
      this.loadingState = state;
    });
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    this.authSerivce.login(value.email, value.password)
  }

  ngOnDestroy() {
    if (this.isLoadingSub){
      this.isLoadingSub.unsubscribe();
    }
  }
}
