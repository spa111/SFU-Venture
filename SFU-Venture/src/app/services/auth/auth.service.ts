import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_BASE_URL } from '../../constants';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsersService } from '../server-apis/users/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient, private usersService: UsersService) {
  }

  login(loginJSON: any): Promise<any> {
    return this.http.post(SERVER_BASE_URL + "/api/signin", loginJSON).toPromise();
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  public get loggedIn(): boolean {
    const helper = new JwtHelperService();
    if (localStorage.getItem('access_token')) {
      if (helper.isTokenExpired(localStorage.getItem('access_token'))) {
        this.logout();
        return false;
      }
      return true;
    }

    return false;
  }
}
