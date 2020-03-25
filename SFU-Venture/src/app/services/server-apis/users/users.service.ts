import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_BASE_URL } from '../../../constants';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  httpOptions: any;

  constructor(
    private http: HttpClient) {
  }

  generateHeaders() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem("access_token")
      })
    };
  }

  getAll(): Promise<any> {
    this.generateHeaders();
    return this.http.get(SERVER_BASE_URL + '/api/users', this.httpOptions).toPromise();
  }

  getById(id: any): Promise<any> {
    this.generateHeaders();
    return this.http.get(SERVER_BASE_URL + '/api/users/' + id, this.httpOptions).toPromise();
  }

  checkHasAdminPrivileges(id: any): Promise<any> {
    this.generateHeaders();
    return this.http.get(SERVER_BASE_URL + '/api/users/checkHasAdminPrivileges/' + id, this.httpOptions).toPromise();
  }
  
  addNewUser(newUserJSON: any): Promise<any> {
    return this.http.post(SERVER_BASE_URL + "/api/signup", newUserJSON).toPromise();
  }

  verifyUserAccount(token: any): Promise<any> {
    return this.http.post(SERVER_BASE_URL + "/api/verify-user-email", token).toPromise();
  }

  forgotPassword(email: any): Promise<any> {
    return this.http.post(SERVER_BASE_URL + "/api/forgot-password", email).toPromise();
  }

  changeForgottenPassword(newPasswordJSON: any): Promise<any> {
    return this.http.post(SERVER_BASE_URL + "/api/change-forgotten-password", newPasswordJSON).toPromise();
  }

  emailSellerAndBuyer(payload: any): Promise<any> {
    this.generateHeaders();
    return this.http.post(SERVER_BASE_URL + "/api/users/emailBuyerAndSeller", payload, this.httpOptions).toPromise();
  }

  update(patchJSON: any): Promise<any> {
    this.generateHeaders();
    return this.http.post(SERVER_BASE_URL + '/api/users/update-password', patchJSON, this.httpOptions).toPromise();
  }

  delete(id: any): Promise<any> {
    this.generateHeaders();
    return this.http.delete(SERVER_BASE_URL + "/api/users/" + id, this.httpOptions).toPromise();
  }
}
