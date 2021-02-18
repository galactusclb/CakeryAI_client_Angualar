import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-navi',
  templateUrl: './main-navi.component.html',
  styleUrls: ['./main-navi.component.scss'],
})
export class MainNaviComponent implements OnInit {
  subscription: Subscription;

  isLoaded: boolean = false;
  ishttpLoaded: boolean = false;

  role: boolean = false;

  username: string = '';
  currentRole: string = '';

  constructor(private _auth: AuthService, private _router: Router) {
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

    this._router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          // console.log('navigation starts');
          this.isLoaded = true;
        } else if (event instanceof NavigationEnd) {
          // console.log('navigation ends');
          this.isLoaded = false;
        }
      },
      (error) => {
        this.isLoaded = false;
        console.log(error);
      }
    );
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

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

  logOut() {
    this._auth.logout();
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    // console.log(window.pageYOffset);
    const navi = document.getElementById('navi');
    if (window.pageYOffset >= 30 && !navi.classList.contains('setBackground')) {
      navi.classList.add('setBackground');
    } else if (
      window.pageYOffset < 30 &&
      navi.classList.contains('setBackground')
    ) {
      navi.style.transition = '.3s';
      navi.classList.remove('setBackground');
    }
    // this.divCurtain.nativeElement.style.top = window.pageYOffset.toString().concat('px');
  }
}
