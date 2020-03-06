import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 
import { UsersService } from '../../../services/server-apis/users/users.service';
import { trigger, state, transition, style, animate } from '@angular/animations';

declare var $: any;

@Component({
  selector: 'app-verify-email-page',
  templateUrl: './verify-email-page.component.html',
  styleUrls: ['./verify-email-page.component.scss'],
  animations: [
    trigger('ActivationWaitingChanged', [
      state('waiting', style({ opacity: 1 })),
      state('waitingComplete', style({ opacity: 0 })),
      transition('waiting => waitingComplete', animate('600ms'))
    ]),
    trigger('accountActivationState', [
      state('attempting', style({ opacity: 0 })),
      state('attemptingComplete', style({ opacity: 1 })),
      transition('attempting => attemptingComplete', animate('600ms'))
    ])
  ]
})
export class VerifyEmailPageComponent implements OnInit {
  
  token: string = "";
  waitingState: string = "waiting";
  attemptingState: string = "attempting";
  countdownTimer = 5;

  constructor(private router: Router, private userService: UsersService, private route: ActivatedRoute) { }

  ngOnInit() {
    // Get the token
    this.token = this.route.snapshot.params['token'];
    let token_details = {
      "token": this.token
    };

    // This setTimeout allows the webpage to load the initial animation of activating an account for 1 second
    setTimeout(() => {
      this.userService.verifyUserAccount(token_details).then((result) => {

        console.log(result);
        this.waitingState = "waitingComplete";
        
        // This setTimeout handles smoothly transitioning the original animation to the success message passed from the server
        setTimeout(() => {
          $("#waitingActivation")[0].style.display = "none";
          this.attemptingState = "attemptingComplete";
          $("h2")[0].innerText = result.response;

          // This setInterval displays a countdown timer that redirects back to the login page 
          var interval = setInterval(() => {

            $("h3")[0].innerText = `Redirecting back to login in ${this.countdownTimer} seconds`;
            if (this.countdownTimer == 0) {
                clearInterval(interval);
                this.router.navigate(['login']);
            }
            this.countdownTimer--;

          }, 1000);
        }, 600);
  
      }).catch(err => {
        console.log(err);
        this.waitingState = "waitingComplete";

        // This setTimeout handles smoothly transitioning the original animation to the failure message passed from the server
        setTimeout(() => {
          $("#waitingActivation")[0].style.display = "none";
          this.attemptingState = "attemptingComplete";
          $("h2")[0].innerText = err.error;

            // This setInterval displays a countdown timer that redirects back to the login page 
            var interval = setInterval(() => {

              $("h3")[0].innerText = `Redirecting back to login in ${this.countdownTimer} seconds`;
              if (this.countdownTimer == 0) {
                  clearInterval(interval);
                  this.router.navigate(['login']);
              }
              this.countdownTimer--;

            }, 1000);
        }, 600);

      });

    }, 1000);
  }
}
