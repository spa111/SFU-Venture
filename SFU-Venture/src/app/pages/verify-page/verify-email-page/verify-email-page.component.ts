import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 
import { UsersService } from '../../../services/server-apis/users/users.service';

@Component({
  selector: 'app-verify-email-page',
  templateUrl: './verify-email-page.component.html',
  styleUrls: ['./verify-email-page.component.scss']
})
export class VerifyEmailPageComponent implements OnInit {
  
  token: string = "";
  loading: boolean = true;

  constructor(private router: Router, private userService: UsersService, private route: ActivatedRoute) { }

  ngOnInit() {
    // Get the token
    this.token = this.route.snapshot.params['token'];
    let token_details = {
      "token": this.token
    };

    this.userService.verifyUserAccount(token_details).then((result) => {
      console.log(result);
      this.loading = false;
      this.router.navigate(['login']);

    }).catch(err => {
      console.log(err);
      this.loading = false;
      
    });
  }

}
