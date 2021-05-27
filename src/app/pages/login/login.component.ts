import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm', { static: false }) public submitForm: NgForm;
  details = {};

  errorMessage: any;

  http_loading: boolean = false;

  isExpiredSession: boolean = true;
  redirectTo: any;

  constructor(
    private Activatedroute: ActivatedRoute,
    private _auth: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.Activatedroute.queryParams.subscribe((queryParams) => {
      this.isExpiredSession = queryParams['expire'];
      this.redirectTo = queryParams['redirectTo'];
    });
  }

  loginUser() {
    this.http_loading = true;
    this._auth.loginUser(this.details).subscribe(
      (res) => {
        console.log(res);
        this.http_loading = false;
        if (res === true) {
          this._auth.getLoginStatus(true);
          this._router.navigate([this.redirectTo || '/app']);
        } else {
          alert(res.error.message);
        }
      },
      (err) => {
        console.log(err);
        this.http_loading = false;
        this.errorMessage = err.error.message;
        this.removeQueryparamsFromURL();
      }
    );
  }

  removeQueryparamsFromURL() {
    this._router.navigate([], {
      queryParams: {
        ...(this.redirectTo ? { redirect: this.redirectTo } : {}),
      },
    });
  }
}
