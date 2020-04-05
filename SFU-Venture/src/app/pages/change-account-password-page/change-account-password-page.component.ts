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
  
  ngOnInit() { 
    $(".login-alert")[0].style.display = "none";
  }

  cancelChanges() {
    this.router.navigate(['account']);
  }

  checkForErrors() {
    let errorString = "";

    if (this.oldPassword == "") {
      errorString += "<p>Error please enter in your old password</p>";
    }

    if (this.newPassword == "") {
      errorString += "<p>Error please enter in a new password</p>";
    }

    if (this.confirmPassword == "") {
      errorString += "<p>Error please confirm your new password<p>";
    }

    if (this.newPassword != this.confirmPassword) {
      errorString += "<p>Error new and confirm passwords need to be the same<p>";
    }

    return errorString;
  }

  checkChangePassword() {
    this.oldPassword = $("#oldPassword")[0].value;
    this.newPassword = $("#newPassword")[0].value;
    this.confirmPassword = $("#confirmPassword")[0].value;

    let errorString = this.checkForErrors();

    if (errorString == "") {
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
          $(".login-alert")[0].style.display = "";
          $(".login-alert .message")[0].innerHTML = "Error old password doesn't match stored records";
        }); 
      }
    } else {
      $(".login-alert")[0].style.display = "";
      $(".login-alert .message")[0].innerHTML = errorString;
    }
  }


}
