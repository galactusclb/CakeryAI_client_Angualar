import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss']
})
export class ConfirmAccountComponent implements OnInit {

  step:number = 0;

  constructor(private Activatedroute: ActivatedRoute,private _auth:AuthService) {
    this.step = 0;
    this.Activatedroute.params.subscribe((params) => {
      console.log(params["token"]);
      this.confirmAccount(params["token"])
    });
   }

  ngOnInit(): void {
  }

  confirmAccount(token){
    this._auth.confirm(token).subscribe(
      res=>{
        console.log(res);
        this.step = 1
      },
      err=>{
        console.error(err);
        this.step = 2
      }
    )
  }
}
