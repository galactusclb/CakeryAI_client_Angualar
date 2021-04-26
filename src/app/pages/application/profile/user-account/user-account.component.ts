import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
})
export class UserAccountComponent implements OnInit {
  changePassword: boolean = false;

  details = {};
  freezedDetails = {};

  Account = { email: '', userName: '', edit: false };
  Personal = {
    fname: '',
    lname: '',
    companyName: '',
    phoneNumber: '',
    edit: false,
  };

  username: any;

  obj_checkUserName = {
    loading: false,
    disabled: true,
  };

  obj_personalDetails = {
    loading: false,
    disabled: false,
  };

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.getUser();
  }

  getUser() {
    if (this._auth.loggedIn()) {
      const user = this._auth.getUserAuth();
      // console.log("user auth " + user.userName);
      this.username = user.userName;
    }
  }

  getUserDetails() {
    this._auth.getuserdetails().subscribe(
      (res) => {
        this.details = res[0];
        this.freezedDetails = res[0];
        Object.freeze(this.freezedDetails);

        for (var key in this.details) {
          if (this.Account.hasOwnProperty(key)) {
            this.Account[key] = this.details[key];
          }

          if (this.Personal.hasOwnProperty(key)) {
            this.Personal[key] = this.details[key];
          }
        }

        console.log(this.details);
        console.log(this.Account);
        console.log(this.Personal);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  showEditBtn(section) {
    if (section == 'Personal') {
      this.Personal['edit'] = true;
    } else {
      this.Account['edit'] = true;
    }
  }

  checkUserName() {
    if (this.username == this.Account['userName']) {
      this.obj_checkUserName['disabled'] = true;
    } else {
      this.obj_checkUserName = {
        loading: true,
        disabled: true,
      };
      this._auth.checkUserName(this.Account).subscribe(
        (res) => {
          console.log(res);
          this.obj_checkUserName = {
            loading: false,
            disabled: false,
          };
        },
        (err) => {
          this.obj_checkUserName = {
            loading: false,
            disabled: true,
          };
          console.log(err);
          if (err.status == 422) {
            console.log(err.error.message);
          }
        }
      );
    }
  }

  updateUserName() {
    if (
      this.username != this.Account['userName'] &&
      !this.obj_checkUserName['disabled']
    ) {
      if (
        confirm(
          'After changing the username, you should need to log in again. Do you want to proceed with it now?'
        )
      ) {
        this.obj_checkUserName = {
          loading: true,
          disabled: true,
        };
        this._auth.updateUserName(this.Account).subscribe(
          (res) => {
            console.log(res);
            this.obj_checkUserName = {
              loading: false,
              disabled: false,
            };
            this.Account['edit'] = false;
            this._auth.logout();
          },
          (err) => {
            console.log(err);
            this.obj_checkUserName = {
              loading: false,
              disabled: false,
            };
          }
        );
      }
    }
  }

  updateUserPersonalDetails() {
    this.obj_personalDetails = {
      loading: true,
      disabled: true,
    };

    this._auth.updateUserPersonalDetails(this.Personal).subscribe(
      (res) => {
        console.log(res);

        this.obj_personalDetails = {
          loading: false,
          disabled: false,
        };

        this.Personal['edit'] = false;
      },
      (err) => {
        console.log(err);
        this.obj_personalDetails = {
          loading: false,
          disabled: false,
        };
      }
    );
  }

  cancel_update(section) {
    for (var key in this.freezedDetails) {
      if (section == 'Account') {
        if (this.Account.hasOwnProperty(key)) {
          this.Account[key] = this.freezedDetails[key];
        }
      } else {
        if (this.Personal.hasOwnProperty(key)) {
          this.Personal[key] = this.freezedDetails[key];
        }
      }
    }

    if (section == 'Account') {
      this.Account['edit'] = false;
    } else {
      this.Personal['edit'] = false;
    }
  }
}
