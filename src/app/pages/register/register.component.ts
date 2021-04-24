import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  details = {};

  errorMessage: any;

  http_loading: boolean = false;
  success: boolean = false;

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {}

  register() {
    this.http_loading = true;
    // this.errorMessage = null;
    this._auth.registerUser(this.details).subscribe(
      (res) => {
        this.http_loading = false;
        console.log(res);
        this.success = true;
      },
      (err) => {
        this.http_loading = false;
        console.log(err);
        this.errorMessage = err.error;
      }
    );
  }
}
