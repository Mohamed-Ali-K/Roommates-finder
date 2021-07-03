/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string ;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userIsAuthenticade = false;
  private _userId = null;

  get userIsAuthenticated() {
    return this._userIsAuthenticade;
  }
  get userId() {
    return this._userId;
  }
  constructor(private router: Router, private http: HttpClient) {}

  singup(email: string, password: string) {
   return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey
  }`,{email: email, password: password, returnSecureToken: true}
  );
  }

  login() {
    this._userIsAuthenticade = true;
  }
  logout() {
    this._userIsAuthenticade = false;
    this.router.navigateByUrl('/auth');
  }
}
