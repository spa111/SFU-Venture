import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/server-apis/users/users.service';

declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private userService: UsersService) { }

  ngOnInit() {
    $(".alert")[0].style.display = "none";

    $(() => {
      $("form").on('submit', (event) => {
        event.preventDefault();
      });
    });
  }

  sendResetRequest() {
    let email = $("input")[0].value;
    if (email) {
      let value_to_send = { "email": email }

      this.userService.forgotPassword(value_to_send).then((result) => {
        let response = result.response;
        $(".message")[0].innerHTML = response;
        $(".alert")[0].style.backgroundColor = "white";
        $(".alert")[0].style.color = "#FF4B2B";
        $(".alert")[0].style.display = "";
  
      }).catch(err => {
        console.log(err);
  
        let response = err.error;
        $(".message")[0].innerHTML = response;
        $(".alert")[0].style.backgroundColor = "white";
        $(".alert")[0].style.color = "#FF4B2B";
        $(".alert")[0].style.display = "";
      });
    }
  }

}
