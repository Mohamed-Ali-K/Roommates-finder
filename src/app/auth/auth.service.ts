import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticade = false;

  get userIsAuthenticated() {
    return this._userIsAuthenticade;
  }
  constructor(private  router: Router) { }
  login() {
    this._userIsAuthenticade = true;
  }
  logout(){
    this._userIsAuthenticade = false;
    this.router.navigateByUrl('/auth');
  }
}
