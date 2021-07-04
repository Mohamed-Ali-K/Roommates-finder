/* eslint-disable no-underscore-dangle */
/* eslint-disable object-shorthand */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.modal';

export interface AuthResponseData{
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService  implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }
  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }
  constructor(private router: Router, private http: HttpClient) {}

  autoLogin() {
    return from(Storage.get({ key: 'authData' })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          userId: string;
          token: string;
          tokenExpeirationDate: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpeirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.email,
          parsedData.userId,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user =>{
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user =>!!user)
    );
  }

  autoLogout( duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
   this.activeLogoutTimer = setTimeout(()=>{
      this.logout();
    }, duration);
  }

  singup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }
  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Storage.remove({key: 'authData'});
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
  private setUserData(userData: AuthResponseData) {
    const exparationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const user =    new User(
      userData.localId,
      userData.email,
      userData.idToken,
      exparationTime
    );
    this._user.next(user
    );
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      exparationTime.toISOString(),
      userData.email
    );
  }
  private storeAuthData(
    userId: string,
    token: string,
    tokenExpeirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({ userId, token, tokenExpeirationDate, email });
    Storage.set({ key: 'authData', value: data });
  }


}
