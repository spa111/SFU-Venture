import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  userLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  goToHome() {
    this.router.navigate(['home']);
  }
}
