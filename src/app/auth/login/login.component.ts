import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authSerivce: AuthService) { }

  ngOnInit(): void {

  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    console.log(value.email);
    this.authSerivce.login(value.email, value.password)
  }
}
