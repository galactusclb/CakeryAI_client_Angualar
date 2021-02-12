import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getSidemenuStatus()
  }

  getSidemenuStatus() {
    const status = localStorage.getItem('side-menu');

    const menu = document.getElementById('side-menu')

    if (status == 'true') {
      menu.classList.add('show')
    } else {
      menu.classList.add('hide')
    }
  }

  sidemenu() {
    const menu = document.getElementById('side-menu')

    if (menu.classList.contains('hide')) {
      menu.classList.remove('hide')
      menu.classList.add('show')
      localStorage.setItem('side-menu', 'true');
    } else {
      menu.classList.remove('show')
      menu.classList.add('hide')
      localStorage.setItem('side-menu', 'false');
    }
  }



  isActive(path: any): boolean {
    // console.log(this.router.isActive('/app/' + path, true));

    return this.router.isActive('/app/' + path, true);
  }
}
