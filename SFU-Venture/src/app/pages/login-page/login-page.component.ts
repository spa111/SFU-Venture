import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router'; 
import { UsersService } from '../../services/server-apis/users/users.service';

declare var $: any;

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements AfterViewInit {

  signUpButton: any;
  signInButton: any;
  container: any;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private usersService: UsersService
  ) { }

  ngAfterViewInit() {
    this.signUpButton = $('#signUp')[0];
    this.signInButton = $('#signIn')[0];
    this.container = $('#container')[0];

    this.signUpButton.addEventListener('click', () => {
      this.container.classList.add("right-panel-active");
    });
  
    this.signInButton.addEventListener('click', () => {
      this.container.classList.remove("right-panel-active");
    });

    $(() => {
      $("#sign-in-form").on('submit', (event) => {
        event.preventDefault();
        this.loginUser();
      });

      $("#sign-up-form").on('submit', (event) => {
        event.preventDefault();
        this.createUser();
      });
    });
  }

  loginUser() {
    console.log("login called");

    let username = $("#login_name")[0].value;
    let password = $("#login_password")[0].value;
    let details = {
      "username": username,
      "password": password
    };

    if (username && password) {
      this.authService.login(details).then((result) => {
        console.log("Login Successful");
        localStorage.setItem("access_token", result.token);
        localStorage.setItem("user", result.user);
        
        this.router.navigate(['']);
      }).catch(err => {
        console.log(err);

      });
    } else {

    }
  }

  createUser() {
    console.log("createUser called");

    let fullname = $("#new_acc_name")[0].value;
    let password = $("#new_acc_password")[0].value;
    let email = $("#new_acc_email")[0].value;
    let is_student = $("#rdo-1")[0].checked;
    let is_faculty = $("#rdo-2")[0].checked;

    let details = {
      "fullname": fullname,
      "password": password,
      "email": email,
      "is_student": is_student,
      "is_faculty": is_faculty
    };

    if (fullname && email && password) {
      this.usersService.addNewUser(details).then((result) => {
        console.log(result);
      }).catch(err => {
        console.log(err);
      })
    } else {

    }
  }
}
