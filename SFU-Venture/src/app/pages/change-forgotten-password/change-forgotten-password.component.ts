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
      state('attemptingSaveComplete', style({ opacity: 1 })),
      transition('waitingSave => attemptingSaveComplete', animate('600ms')),
      transition('attemptingSaveComplete => waitingSave', animate('600ms'))
    ])
  ]
})
export class ChangeForgottenPasswordComponent implements OnInit {

  token: any;
  changingState: string = "changing";
  savingState: string = "waitingSave";

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

  }
}
