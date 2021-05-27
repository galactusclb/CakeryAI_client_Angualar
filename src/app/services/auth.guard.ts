import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // console.log(next.firstChild.data);
    // console.log(next.url); //   /app
    // console.log(state.url); //  /app/product   ***full path

    if (this._authService.loggedIn()) {
      return true;
    } else {
      let url = '';

      // if (next.data.redirectTo !== undefined) {
      // option 1 // using data tag in route module
      // url = next.data.redirectTo[0];
      // this._router.navigate(['/login'], {
      //   queryParams: { redirectTo: url },
      // });
      if (state.url) {
        // option 2 // using current url
        this._router.navigate(['/login'], {
          queryParams: { redirectTo: state.url },
        });
      } else {
        this._router.navigate(['/login']);
      }

      return false;
    }
  }
}
