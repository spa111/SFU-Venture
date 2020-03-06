import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/server-apis/users/users.service';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router'; 

declare var $: any;

@Component({
  selector: 'app-change-forgotten-password',
  templateUrl: './change-forgotten-password.component.html',
  styleUrls: ['./change-forgotten-password.component.scss'],
  animations: [
    trigger('passwordWaitingChanged', [
      state('changing', style({ opacity: 1 })),
      state('changingComplete', style({ opacity: 0 })),
      transition('changing => changingComplete', animate('600ms')),
      transition('changingComplete => changing', animate('600ms'))
    ]),
    trigger('passwordUpdateState', [
      state('waitingSave', style({ opacity: 0 })),
      state('saveComplete', style({ opacity: 1 })),
      transition('waitingSave => saveComplete', animate('600ms')),
      transition('saveComplete => waitingSave', animate('600ms'))
    ])
  ]
})
export class ChangeForgottenPasswordComponent implements OnInit {

  token: any;
  changingState: string = "changing";
  savingState: string = "waitingSave";
  countdownTimer = 5;

  // changeSuccess: boolean = false;
  serverResponse: string = "";

  constructor(private userService: UsersService, private router: Router, private route: ActivatedRoute) {
    this.token = this.route.snapshot.params['token'];
  }

  ngOnInit() {
    $(() => {
      $("form").on('submit', (event) => {
        event.preventDefault();
      });
    });
  }
  
  checkSamePasswords(id) {
    let input: any;

    if (id == "password1") {
      input = $("#password1")[0];
    } else {
      input = $("#password2")[0];
    }

    if (input.value != $("#password1")[0].value) {
        input.setCustomValidity('Password Must be Matching.');
    } else {
        // input is valid -- reset the error message
        input.setCustomValidity('');
    }
  }

  changePassword() {
    let password = $("#password1")[0].value;
    let payload = {
      "token" : this.token,
      "password" : password
    };

    this.userService.changeForgottenPassword(payload).then((result) => {
      // this.changeSuccess = true;
      this.changingState = "changingComplete";
      this.serverResponse = result.response;
      this.handleAnimation();

    }).catch(err => {
      // this.changeSuccess = false;
      this.changingState = "changingComplete";
      this.serverResponse = err.error;
      this.handleAnimation();

    });
  }

  handleAnimation() {
    setTimeout(() => {
      $("#waitingChange")[0].style.display = "none";
      this.savingState = "saveComplete";
      $("h2")[0].innerText = this.serverResponse;
    
      // This setInterval displays a countdown timer that redirects back to the login page 
      var interval = setInterval(() => {

        $(".message h3")[0].innerText = `Redirecting back to login in ${this.countdownTimer} seconds`;
        if (this.countdownTimer == 0) {
            clearInterval(interval);
            this.router.navigate(['login']);
        }
        this.countdownTimer--;

      }, 1000);
    }, 600);
  }
}
