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
  }

  sidemenu() {
    const menu = document.getElementById('side-menu')

    if (menu.classList.contains('hide')) {
      menu.classList.remove('hide')
      menu.classList.add('show')
    } else {
      menu.classList.remove('show')
      menu.classList.add('hide')
    }

  }

  isActive(path: any): boolean {
    console.log(this.router.isActive('/app/' + path, true));

    return this.router.isActive('/app/' + path, true);
  }
}
