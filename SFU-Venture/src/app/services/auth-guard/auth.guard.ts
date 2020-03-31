import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  getToken() {
    return localStorage.getItem('access_token');
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const helper = new JwtHelperService();
    
    if (this.getToken()) {
      if (helper.isTokenExpired(this.getToken())) {
        this.router.navigate(['logout']);
        return false;
      }

      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}