import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit {
  role: boolean = false;

  username: any = 'chanaka';
  currentRole: any = 'admin';

  constructor(private router: Router, private _auth: AuthService) {
    this._auth.newLoginStatus.subscribe((status) => {
      if (status == true) {
        this.displayUser();
        this.checkRole();
      }
    });
  }

  ngOnInit(): void {
    this.checkRole();
    this.displayUser();
    this.getSidemenuStatus();
  }

  getisLogged(): boolean {
    return this._auth.loggedIn();
  }

  displayUser() {
    if (this._auth.loggedIn()) {
      const user = this._auth.getUserAuth();
      // console.log("user auth " + user.userName);
      this.currentRole = user.role;
      this.username = user.userName;
    }
  }

  checkRole() {
    this.role = this._auth.checkAuthorization();
  }

  getSidemenuStatus() {
    const status = localStorage.getItem('side-menu');

    const menu = document.getElementById('side-menu');

    if (!status || status == 'true') {
      menu.classList.add('show');
    } else {
      menu.classList.add('hide');
    }
  }

  sidemenu() {
    const menu = document.getElementById('side-menu');

    if (menu.classList.contains('hide')) {
      menu.classList.remove('hide');
      menu.classList.add('show');
      localStorage.setItem('side-menu', 'true');
    } else {
      menu.classList.remove('show');
      menu.classList.add('hide');
      localStorage.setItem('side-menu', 'false');
    }
  }

  isActive(path: any): boolean {
    // console.log(this.router.isActive('/app/' + path, true));

    return this.router.isActive('/app/' + path, true);
  }

  logOut() {
    this._auth.logout();
  }
}
