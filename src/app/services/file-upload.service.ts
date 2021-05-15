import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
const BACKEND_URL = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private _uploadReport = BACKEND_URL + 'upload-report';
  private _getuserreports = BACKEND_URL + 'getuserreports';
  private _changereportsactivesettingsUrl =
    BACKEND_URL + 'changereportsactivesettings';
  private _trainModelUrl = BACKEND_URL + 'trainmodel';
  private _getpredictionproUrl = BACKEND_URL + 'getpredictionpro';
  private _deletereport = BACKEND_URL + 'delete-report';
  private _addingredientsdetails = BACKEND_URL + 'addingredientsdetails';
  private _getIngredientsDetails = BACKEND_URL + 'getingredientsdetails';
  private _getactivatedmodeldetailsUrl =
    BACKEND_URL + 'getactivatedmodeldetails';
  private _addproductsdetailsUrl = BACKEND_URL + 'addproductsdetails';
  private _getProductsDetailsUrl = BACKEND_URL + 'getproductsdetails';
  private _getproductsnameUrl = BACKEND_URL + 'getproductsname';
  private _getProductDetailsByProductUrl =
    BACKEND_URL + 'getproductdetailsbyproduct';
  private _updateproductUrl = BACKEND_URL + 'updateproduct';
  private _deleteproductUrl = BACKEND_URL + 'deleteproduct';
  private _getSalesReportUrl = BACKEND_URL + 'getSalesReport';
  private _getpreviousSaleswithpredictUrl =
    BACKEND_URL + 'getpreviousSaleswithpredict';
  private _getPredictonsByMonthUrl = BACKEND_URL + 'getPredictonsByMonth';

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

  deleteReport(data: any) {
    return this.http.delete<any>(`${this._deletereport}/${data}`);
  }

  getuserreports(data: any = '') {
    return this.http.get<any>(this._getuserreports, {
      params: {
        userId: data,
      },
    });
  }

  trainModel(reportID: any) {
    return this.http.get<any>(this._trainModelUrl, {
      params: {
        reportID: reportID,
      },
    });
  }

  changeReportsActiveSettings(data: any) {
    return this.http.put<any>(this._changereportsactivesettingsUrl, data);
  }

  addIngredientsDetails(data: any) {
    return this.http.post<any>(this._addingredientsdetails, data);
  }

  getIngredientsDetails() {
    return this.http.get<any>(this._getIngredientsDetails);
  }

  getActivatedModelDetails() {
    return this.http.get<any>(this._getactivatedmodeldetailsUrl);
  }

  addproductsdetails(details) {
    return this.http.post<any>(this._addproductsdetailsUrl, details);
  }

  updateproduct(data: any) {
    return this.http.post<any>(this._updateproductUrl, data);
  }

  getProductsDetails() {
    return this.http.get<any>(this._getProductsDetailsUrl);
  }

  getproductsName() {
    return this.http.get<any>(this._getproductsnameUrl);
  }

  getProductDetailsByProduct(id: any) {
    return this.http.get<any>(`${this._getProductDetailsByProductUrl}/${id}`);
  }

  deleteproduct(id: any) {
    return this.http.get<any>(`${this._deleteproductUrl}/${id}`);
  }

  readCSVFileFromAWS() {
    return this.http.get<any>(this._getSalesReportUrl);
  }

  getPreviousSalesWithPredict(productID) {
    return this.http.get<any>(this._getpreviousSaleswithpredictUrl, {
      params: {
        productID,
      },
    });
  }

  getPredictonsByMonth(productID, monthsCount: any = 1) {
    return this.http.get<any>(this._getPredictonsByMonthUrl, {
      params: {
        productID,
        months: monthsCount,
      },
    });
  }

  // pro users
  getPredictionPro(productID: any) {
    return this.http.get<any>(this._getpredictionproUrl, {
      params: {
        productID,
      },
    });
  }
}
