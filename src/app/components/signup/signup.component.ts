import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment'


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user = {
    email: "",
    name: "",
    dob: "",
    gender: "",
    institute: "",
    schoolClass: "",
    schoolBoard: "",
    collegeCourse: ""
  };
  otp = "";

  settings = environment.settings
  showOtpField = false;
  isSignedIn = false;
  otpSent: boolean = false;
  errorMessage: string | null = null;
  isSignupLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.otpSent) {
      if (!this.otp || this.otp.trim() === "") {
        this.errorMessage = "Please enter the OTP.";
        return;
      }
      this.isSignupLoading = true;
      this.verifyOtp();
    } else {
      this.isSignupLoading = true;
      this.sendOtp();
    }
  }

  onOtpChange() {
    // This method will just trigger change detection for OTP input
  }

  sendOtp() {
    this.authService.sendSignupOtp(this.user).subscribe(
      (res) => {
        this.otpSent = true;
        this.errorMessage = null;
        this.isSignupLoading = false;
      },
      (err) => {
        console.log('err', err)
        this.isSignupLoading = false;
        this.errorMessage = "Failed to send OTP. Please try again.";
      }
    );
  }

  signup() {
    this.authService.signup(this.user).subscribe(
      (res: any) => {
        this.showOtpField = true;
      },
      err => alert("Error: " + err.error.message)
    );
  }

  verifyOtp() {
    this.authService.verifyOtp(this.user, this.otp).subscribe(
      (res: any) => {
        // alert("Signup successful!");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(res["user"]));
        localStorage.setItem('chatbotStyle', JSON.stringify(this.settings[0].options[0]));
        this.isSignedIn = true;
        // navigae to home component
        this.router.navigate(['/home']);
      },
      err => {
        this.errorMessage = "Invalid OTP. Please try again.";
        this.isSignupLoading = false;
      }
    );
  }
}
