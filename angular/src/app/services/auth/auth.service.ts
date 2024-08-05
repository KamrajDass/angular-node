import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from "jwt-decode";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/'; // Adjust to your backend URL
  private readonly TOKEN_KEY = 'token';

  private http = inject(HttpClient);

  userDetails = {
    isLoggedIn: signal<boolean>(false),
    username: signal<string>(''),
  }

  checkUsername(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}users/check-username?username=${username}`);
  }


  // Signup method
  signup(formValues: any): Observable<any> {
    const { username, email, firstname, lastname, password } = formValues
    return this.http.post<any>(`${this.apiUrl}users/signup`, { username, email, firstname, lastname, password }).pipe(
      tap(response => {
        // Store token and update the observable
        localStorage.setItem(this.TOKEN_KEY, response.token);
      }),

    );
  }

  // Login method
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}users/login`, { username, password }).pipe(
      tap(response => {
        // Store token and update the observable
        localStorage.setItem(this.TOKEN_KEY, response.token);
      }),

    );
  }

  // Decode token and get expiry time
  isTokenExpired() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      let decode: any = jwtDecode(token);
      if (Math.floor((new Date).getTime() / 1000) >= decode.exp) {
        localStorage.removeItem(this.TOKEN_KEY)
        this.userDetails.isLoggedIn.set(false)
      } else {
        this.userDetails.username.set(decode.username)
        this.userDetails.isLoggedIn.set(true)
      }
    }
  }


  // Handle errors

}
