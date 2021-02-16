import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
const BACKEND_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private _uploadReport = BACKEND_URL + 'upload-report';

  constructor(private http: HttpClient) {}

  uploadReport(data: any) {
    // uploadReport(file: File, data: any) {
    // const formData = new FormData();

    // formData.append('report', file);
    // formData.append('selectedColumns', data['month']);

    return this.http.post<any>(this._uploadReport, data, {
      reportProgress: true,
      observe: 'events',
    });
  }
}
