import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, mapTo } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _registerUrl = BACKEND_URL + 'registerUser';
  private _confirmUrl = BACKEND_URL + 'confirmemail';
  private _loginUrl = BACKEND_URL + 'loginUser';
  private _forgetPasswordUrl = BACKEND_URL + 'forgetpassword';
  private _resetpasswordUrl = BACKEND_URL + 'resetpassword';
  private _getPermisionUserUrl = BACKEND_URL + 'getPermisionUser';
  private _getuserdetailsUrl = BACKEND_URL + 'getuserdetails';
  private _checkusernameUrl = BACKEND_URL + 'checkusername';
  private _updateUserNameUrl = BACKEND_URL + 'updateusername';
  private _updateUserPersonalDetailsUrl =
    BACKEND_URL + 'updateuserpersonaldetails';

  private token: string;
  private tokenTimer: any;
  private userId: string;
  private userName: string;
  private role: string;
  private isAuthenticated = false;

  private newLogin = new BehaviorSubject(false); //1
  newLoginStatus = this.newLogin.asObservable(); //2

  constructor(private http: HttpClient, private _router: Router) {}

  registerUser(user) {
    return this.http.post<any>(this._registerUrl, user);
  }

  confirm(details) {
    return this.http.post<any>(this._confirmUrl, { token: details });
  }

  loginUser(details): Observable<any> {
    return this.http.post<any>(this._loginUrl, details).pipe(
      tap((res) => {
        const token = res.jwtToken;
        this.token = token;

        if (token) {
          const expiresInDuration = res.expiresIn;
          // console.log("expire in : :" + expiresInDuration);
          this.setAuthTimer(expiresInDuration);

          this.userId = res._uid;
          this.userName = res.userName;
          this.role = res.role;
          //this.authStatusListener.next(true);
          // this.getLoginStatus(true);

          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );

          console.log(expirationDate);

          this.saveAuthData(
            token,
            expirationDate,
            this.userId,
            this.userName,
            this.role
          );
          // this._router.navigate(['/dashboard'])
        }
      }),
      mapTo(true),
      catchError(this.errorHandler)
    );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.clearAuthData();
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.getLoginStatus(true); //5
    this._router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: String,
    userName: string,
    role: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem(
      'userAuth',
      JSON.stringify({ userId: userId, userName: userName, role: role })
    );
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error || 'Something went wrong.Please try again later.');
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userAuth');
  }

  getLoginStatus(newLoginInstance: boolean) {
    //3
    this.newLogin.next(newLoginInstance);
  }

  checkAuthorization(): boolean {
    //4
    const user = this.getUserAuth();

    if (this.loggedIn()) {
      if (this.getUserAuth()) {
        if (user.role === 'admin') {
          // console.log("admin " + true);
          return true;
        }
      }
    }
    return false;
  }

  getUserAuth() {
    return JSON.parse(localStorage.getItem('userAuth'));
  }

  getPermisionUser() {
    return this.http.get<any>(this._getPermisionUserUrl);
  }

  getPermision() {
    return !!this.getPermisionUser();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  loggedIn() {
    if (!!localStorage.getItem('token')) {
      var now = moment(new Date());
      var end = moment(localStorage.getItem('expiration'));
      var duration = moment.duration(end.diff(now, 'seconds'));
      this.setAuthTimer(duration['_milliseconds']);
    }
    return !!localStorage.getItem('token');
  }

  // EXTRA
  forgetPassword(user) {
    return this.http.post<any>(this._forgetPasswordUrl, user);
  }

  resetPassword(details) {
    return this.http.post<any>(this._resetpasswordUrl, details);
  }

  getuserdetails() {
    return this.http.get<any>(this._getuserdetailsUrl);
  }

  checkUserName(details) {
    return this.http.post<any>(this._checkusernameUrl, details);
  }

  updateUserName(details) {
    return this.http.post<any>(this._updateUserNameUrl, details);
  }

  updateUserPersonalDetails(details) {
    return this.http.post<any>(this._updateUserPersonalDetailsUrl, details);
  }
}
