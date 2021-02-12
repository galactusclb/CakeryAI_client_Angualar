import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  details = {}

  constructor(private _auth: AuthService) { }

  ngOnInit(): void {}

  register(){
    this._auth.registerUser(this.details).subscribe(
      res=>{
        console.log(res);
      },
      err=>{
        console.log(err);        
      }
    )
  }
}
