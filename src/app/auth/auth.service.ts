import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticade = false;

  get userIsAuthenticated() {
    return this._userIsAuthenticade;
  }
  constructor() { }
  login() {
    this._userIsAuthenticade = true;
  }
  logout(){
    this._userIsAuthenticade = false;
  }
}
