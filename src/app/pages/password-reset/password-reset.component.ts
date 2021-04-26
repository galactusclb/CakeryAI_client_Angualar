import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  details = {};

  errorMessage = [];

  isHttpError: boolean = false;
  reqLoading: boolean = false;

  errorStatus: number;
  errorString: any;

  constructor(
    private _auth: AuthService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const user = queryParams['a'];
      const token = queryParams['t'];

      this.details['user'] = user;
      this.details['token'] = token;
    });
  }

  resetPassword() {
    this.reqLoading = true;
    this.isHttpError = false;

    this.errorStatus = null;
    this.errorString = null;

    this._auth.resetPassword(this.details).subscribe(
      (res) => {
        this.reqLoading = false;
      },
      (err) => {
        this.reqLoading = false;
        this.isHttpError = true;
        console.log(err);

        if (err.status === 422 && err.error != '') {
          if (typeof err.error === 'string' || err.error instanceof String) {
            this.errorStatus = 422;
            this.errorString = err.error;
          }
          this.errorMessage = err.error.errors;
          console.log(this.errorMessage);
        } else if (err.status === 500 && err.error != '') {
          if (typeof err.error === 'string' || err.error instanceof String) {
            this.errorStatus = 500;
            this.errorString = err.error;
          }
        }
      }
    );
  }
}
