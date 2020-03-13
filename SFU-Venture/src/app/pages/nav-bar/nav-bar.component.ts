import { HostListener, Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  isLoggedOn: Boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    router.events.subscribe(() => {
      this.isLoggedOn = authService.loggedIn;
    });
  }

  ngOnInit() {
    this.isLoggedOn = this.authService.loggedIn;
  }

  goToHome() {
    this.router.navigate(['home']);
  }
}
