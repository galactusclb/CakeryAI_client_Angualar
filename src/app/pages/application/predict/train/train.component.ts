import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss'],
})
export class TrainComponent implements OnInit {
  constructor(
    private _upload: FileUploadService,
    private _auth: AuthService,
    private Activatedroute: ActivatedRoute
  ) {}

  userId: any;
  data: any = [];
  productList: any = [];

  httpLoading: boolean = false;

  highlightReport: any = '';

  ngOnInit(): void {
    this.getProductDetails();
    this.getUserDetails();

    if (this.userId) {
      this.getUploadedReportsByUserId(this.userId);
    }

    this.Activatedroute.queryParams.subscribe((queryParams) => {
      this.highlightReport = queryParams['_id'];
    });
  }

  getUserDetails() {
    if (this._auth.loggedIn()) {
      const user = this._auth.getUserAuth();
      this.userId = user.userId;
    }
  }

  getUploadedReportsByUserId(userId: string) {
    this._upload.getuserreports(userId).subscribe(
      (res) => {
        console.log(res);
        this.data = res;

        this.data.forEach((element) => {
          if (element?.['timestamp']) {
            element['timestamp'] = moment(element['timestamp']).format(
              'YYYY/MM/DD, H:mm '
            );
          }

          element['headers'] = JSON.parse(element?.['headers']);
          element['mappedProducts'] = [];
          element['headers'].forEach((product) => {
            if (product['mappedProductID'] != 'Month') {
              element?.['mappedProducts'].push(product);

              // set mapped product name for csv column products
              element?.['mappedProducts'].forEach((product) => {
                product['productName'] = this.getMappedProductName(
                  product['mappedProductID']
                );
              });
            }
          });

          const lastMonthDetails = element?.['lastMonthDetails'].split(',');

          element['lastMonth'] = moment(lastMonthDetails[0]).format(
            'MMMM YYYY'
          );

          if (this.highlightReport == element['_id']) {
            element['highlightReport'] = true;
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getProductDetails() {
    this._upload.getProductsDetails().subscribe(
      (res) => {
        console.log(res);
        this.productList = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getMappedProductName(productID) {
    let name = '';

    this.productList.forEach((element) => {
      if (element['_id'] == productID) {
        name = element['productName'];
      }
    });
    return name;
  }

  changeReportsActiveSettings(_id: string, active: number) {
    if (!this.httpLoading) {
      this.httpLoading = true;
      this._upload
        .changeReportsActiveSettings({ _id: _id, active: active })
        .subscribe(
          (res) => {
            this.getUploadedReportsByUserId(this.userId);
            this.httpLoading = false;
          },
          (err) => {
            console.log(err);
            this.httpLoading = false;
          }
        );
    }
  }

  trainModel(_id: string) {
    if (!this.httpLoading) {
      this.httpLoading = true;
      console.log(_id);

      this._upload.trainModel(_id).subscribe(
        (res) => {
          console.log(res);

          this.getUploadedReportsByUserId(this.userId);
          this.httpLoading = false;
        },
        (err) => {
          console.log(err);
          this.httpLoading = false;
        }
      );
    }
  }

  deleteReport(_id: string) {
    if (confirm('Are you sure to delete this report?')) {
      this._upload.deleteReport(_id).subscribe(
        (res) => {
          this.getUploadedReportsByUserId(this.userId);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }
}
