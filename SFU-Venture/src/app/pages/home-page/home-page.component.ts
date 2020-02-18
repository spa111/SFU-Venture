import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/server-apis/users/users.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private userService : UsersService) { }

  ngOnInit() {
    // Console.log the users on the homepage for connection testing
    console.log(this.userService.getAll());
  }
}
