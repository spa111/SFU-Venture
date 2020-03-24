import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/server-apis/users/users.service';

declare var $: any;

@Component({
  selector: 'app-change-account-password-page',
  templateUrl: './change-account-password-page.component.html',
  styleUrls: ['./change-account-password-page.component.scss']
})
export class ChangeAccountPasswordPageComponent implements OnInit {
  oldPassword: String;
  newPassword: String;
  confirmPassword: String;

  constructor(private router: Router, private usersService: UsersService) { }
  
  ngOnInit() { }

  cancelChanges() {
    this.router.navigate(['account']);
  }

  checkChangePassword() {
    this.oldPassword = $("#oldPassword")[0].value;
    this.newPassword = $("#newPassword")[0].value;
    this.confirmPassword = $("#confirmPassword")[0].value;

    if (this.oldPassword != "") {
      if (this.newPassword === this.confirmPassword && this.newPassword != "") {
        let payload = {
          "id": localStorage.getItem('user'),
          "oldPassword": this.oldPassword,
          "newPassword": this.newPassword
        }

        this.usersService.update(payload).then(result => {
          this.router.navigate(['logout']);
        }).catch(err => {
          console.log(err);
        })
        
      }
    }
  }


}
