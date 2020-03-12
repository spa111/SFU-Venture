import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private router: Router) { }

  getToken() {
    return localStorage.getItem('access_token');
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const helper = new JwtHelperService();

    if (this.getToken()) {
      if (helper.isTokenExpired(this.getToken())) {
        localStorage.removeItem("access_token");
        return true;
      }

      this.router.navigate([this.router.url]);
      return false;
    }
    return true;
  }
}