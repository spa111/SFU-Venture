import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/server-apis/users/users.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  loggedIn: Boolean = false;

  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.loggedIn = this.authService.loggedIn;
  }
}
