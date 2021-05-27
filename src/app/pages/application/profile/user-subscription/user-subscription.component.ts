import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.scss'],
})
export class UserSubscriptionComponent implements OnInit {
  details = {};

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails() {
    this._auth.getuserdetails().subscribe(
      (res) => {
        this.details = res[0];
        console.log(this.details);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
