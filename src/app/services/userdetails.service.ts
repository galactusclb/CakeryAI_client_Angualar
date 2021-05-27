import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
const BACKEND_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class UserdetailsService {
  private _subscribepremiumplanURL = BACKEND_URL + 'subscribepremiumplan';

  constructor(private http: HttpClient) {}

  subscribePremiumPlan(details: any) {
    return this.http.post<any>(this._subscribepremiumplanURL, details);
  }
}
