import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _userIsAuthenticade = true;
  private _userId = 'aaa';

  get userIsAuthenticated() {
    return this._userIsAuthenticade;
  }
  get userId() {
    return this._userId;
  }
  constructor(private router: Router) {}
  login() {
    this._userIsAuthenticade = true;
  }
  logout() {
    this._userIsAuthenticade = false;
    this.router.navigateByUrl('/auth');
  }
}
