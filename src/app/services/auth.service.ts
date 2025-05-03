import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  signup(user: any) {
    return this.http.post(`${this.baseUrl}/auth/signup`, { user: user });
  }

  verifyOtp(user: {}, otp: string) {
    return this.http.post(`${this.baseUrl}/auth/verify-otp`, { user, otp });
  }

  login(email: string) {
    return this.http.post(`${this.baseUrl}/auth/login`, { email });
  }

  verifyLoginOtp(email: {}, otp: string) {
    return this.http.post(`${this.baseUrl}/auth/verify-login`, { email, otp });
  }

  // Send OTP to the email address
  sendSignupOtp(user: {}): Observable<any> {
    const body = { user };
    return this.http.post<any>(`${this.baseUrl}/auth/signup`, body);
  }


}
