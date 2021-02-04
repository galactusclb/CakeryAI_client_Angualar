import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-main-navi',
  templateUrl: './main-navi.component.html',
  styleUrls: ['./main-navi.component.scss']
})
export class MainNaviComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  getisLogged() {
    return false;
  }

  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    // console.log(window.pageYOffset);
    const navi = document.getElementById('navi')
    if (window.pageYOffset >= 30 && !navi.classList.contains('setBackground')) {
      navi.classList.add('setBackground')
    } else if (window.pageYOffset < 30 && navi.classList.contains('setBackground')) {
      navi.style.transition = '.3s';
      navi.classList.remove('setBackground')
    }
    // this.divCurtain.nativeElement.style.top = window.pageYOffset.toString().concat('px');
  }
}
