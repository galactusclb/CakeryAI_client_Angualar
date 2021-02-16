import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private _authService: AuthService, private _router: Router) { }
  
  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean{
    if (this._authService.loggedIn()) {
      return true;
    }else {
      let url = "";

      if (next.data.redirectTo !== undefined) {
        url = next.data.redirectTo[0];
        this._router.navigate(["/login"], {
          queryParams: { redirectTo: url },
        });
      }else {
        this._router.navigate(["/login"]);
      }

      return false;
    }
  }
}
