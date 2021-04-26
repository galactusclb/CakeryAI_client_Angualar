import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
})
export class ForgetPasswordComponent implements OnInit {
  Details = {};

  ishttpLoaded: boolean = false;
  reqLoading: boolean = false;
  isHttpError: boolean = false;

  success: boolean = false;

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {}

  forget() {
    this.success = false;

    this.isHttpError = false;
    this.reqLoading = true;

    this._auth.forgetPassword(this.Details).subscribe(
      (res) => {
        this.reqLoading = false;
        this.success = true;
      },
      (err) => {
        this.reqLoading = false;
        console.log(err);
        this.isHttpError = true;
      }
    );
  }
}
