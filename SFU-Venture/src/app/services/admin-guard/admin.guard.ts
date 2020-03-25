import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsersService } from '../server-apis/users/users.service';
import { Location } from '@angular/common';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private usersService: UsersService, private location: Location) { }

  getToken() {
    return localStorage.getItem('access_token');
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      const helper = new JwtHelperService();

      if (this.getToken()) {
        if (helper.isTokenExpired(this.getToken())) {

          this.router.navigate(['logout']);
          resolve(false);
        } else {
          this.usersService.checkHasAdminPrivileges(localStorage.getItem('user')).then(result => {

            if (result.hasPrivileges) {
              resolve(true);
            } else {
              this.location.back();
              resolve(false);
            }
          }).catch(err => {
            console.log(err);
          })
        }
      } else {
        this.router.navigate(['login']);
        resolve(false);
      }    
    });
  }
}