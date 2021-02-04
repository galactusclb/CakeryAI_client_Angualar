import { Component, OnInit, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, ActivationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Analytics';
  currentRoute: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // this.Activatedroute.parent.subscribe((queryParams) => {
    //   console.log(queryParams);

    // });
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        // console.log(event.snapshot);
        const path = event.snapshot['_routerState']['url']
        //console.log(path);

        if (path && path.includes('/app/')) {
          this.currentRoute = true
        } else this.currentRoute = false;
      }
    })
  }



}
