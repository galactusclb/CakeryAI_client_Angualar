import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  details = {};

  errorMessage: any;

  constructor(private _auth: AuthService, private _router: Router) {}

  ngOnInit(): void {}

  loginUser() {
    this._auth.loginUser(this.details).subscribe(
      (res) => {
        console.log(res);
        if (res === true) {
          this._auth.getLoginStatus(true);
          this._router.navigate(['/app']);
        } else {
          alert(res.error.message);
        }
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.error.message;
      }
    );
  }
}
