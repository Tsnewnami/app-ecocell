import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    this.authService.resetPasswordInit(value.email)
      .then(
        () => alert('A password reset link has been sent to your email address'),
        (rejectionReason) => alert(rejectionReason))
      .catch(e => alert('An error occurred while attempting to reset your password')
      );
  }

}
