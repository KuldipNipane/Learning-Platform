import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = "";
  otp = "";
  otpSent = false;
  isLoggedIn = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (this.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }


  onSubmit() {
    if (this.otpSent) {
      // If OTP is already sent, verify it
      this.verifyOtp();
    } else {
      // If OTP is not sent, trigger the OTP sending
      this.sendOtp();
    }
  }

  sendOtp() {
    this.authService.login(this.email).subscribe(
      (res: any) => {
        alert("OTP sent to email!");
        this.otpSent = true;
      },
      err => alert("User not found")
    );
  }

  verifyOtp() {
    this.authService.verifyLoginOtp(this.email, this.otp).subscribe(
      (res: any) => {
        alert("Login successful!");
        localStorage.setItem("isLoggedIn", "true");
        this.isLoggedIn = true;
        this.router.navigate(['/home']);
      },
      err => alert("Invalid OTP")
    );
  }
}
