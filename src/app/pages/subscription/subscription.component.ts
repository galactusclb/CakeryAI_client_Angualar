import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserdetailsService } from 'src/app/services/userdetails.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  user = {};
  httploading: boolean = false;

  constructor(
    private _userDetails: UserdetailsService,
    private _auth: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if (this.isLogged()) {
      this.getUserDetails();
    }
    console.log(this.isLogged());
  }

  buyPlan(level: number) {
    if (this.isLogged()) {
      this._userDetails
        .subscribePremiumPlan({ subscriptionLevel: level })
        .subscribe(
          (res) => {
            console.log(res);
            this.getUserDetails();
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this._router.navigate(['/login'], {
        queryParams: { redirectTo: '/subscription' },
      });
    }
  }

  isLogged() {
    return this._auth.loggedIn();
  }

  getUserDetails() {
    this.httploading = true;
    this._auth.getuserdetails().subscribe(
      (res) => {
        this.user = res[0];
        console.log(this.user);
        this.httploading = false;
      },
      (err) => {
        console.log(err);
        this.httploading = false;
      }
    );
  }
}
