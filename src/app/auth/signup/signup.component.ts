import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    this.authService.signup(value.email, value.password);
  }

}
