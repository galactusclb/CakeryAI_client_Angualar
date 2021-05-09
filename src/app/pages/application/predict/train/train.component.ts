import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss'],
})
export class TrainComponent implements OnInit {
  constructor(private _upload: FileUploadService, private _auth: AuthService) {}

  userId: any;
  data: any = [];
  httpLoading: boolean = false;

  ngOnInit(): void {
    this.getUserDetails();

    if (this.userId) {
      this.getUploadedReportsByUserId(this.userId);
    }
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
            }
          });

          console.log(element?.['mappedProducts']);
        });
      },
      (err) => {
        console.log(err);
      }
    );
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
      this._upload.trainModel({ _id: _id }).subscribe(
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
