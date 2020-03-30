import { HostListener, Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth/auth.service';
import { UsersService } from '../../services/server-apis/users/users.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  isLoggedOn: Boolean = false;
  userHasAdminPrivileges: Boolean = false;
  userPrivilegesChecked: Boolean = false;

  constructor(private router: Router, private authService: AuthService, private usersService: UsersService) { }

  checkLogin() {
    this.isLoggedOn = this.authService.loggedIn;

    if (this.authService.loggedIn && !this.userPrivilegesChecked) {
      this.usersService.checkHasAdminPrivileges(localStorage.getItem('user')).then(result => {
        this.userHasAdminPrivileges = result.hasPrivileges;
        this.userPrivilegesChecked = true;

      }).catch(err => {
        console.log(err);

      });
    } else if (!this.authService.loggedIn) {
      this.userPrivilegesChecked = false;
    }

    return this.isLoggedOn;
  }

  ngOnInit() {
    this.isLoggedOn = this.authService.loggedIn;
  }

  goToHome() {
    this.router.navigate(['home']);
  }
}
