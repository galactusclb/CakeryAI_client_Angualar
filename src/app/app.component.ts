import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Analytics';
  currentRoute: boolean = false;

  constructor(private router: Router, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // this.Activatedroute.parent.subscribe((queryParams) => {
    //   console.log(queryParams);

    // });
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        // console.log(event.snapshot);
        const path = event.snapshot['_routerState']['url'];
        //console.log(path);

        if (path && path.includes('/app/')) {
          this.currentRoute = true;
        } else this.currentRoute = false;
      }
    });

    addEventListener('offline', () => {
      this._snackBar.open('please check your internet connection', 'ok', {
        duration: 5000,
      });
    });
  }
}
