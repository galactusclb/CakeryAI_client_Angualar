import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('loginForm', { static: false }) public submitForm: NgForm;
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
