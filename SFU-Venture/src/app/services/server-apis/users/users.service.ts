import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_BASE_URL } from '../../../constants';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(SERVER_BASE_URL + '/users');
  }

  getById(id: any): Observable<any> {
    return this.http.get(SERVER_BASE_URL + '/users/' + id);
  }

  addNewUser(newUserJSON: any): Promise<any> {
    return this.http.post(SERVER_BASE_URL + "/users", newUserJSON).toPromise();
  }

  update(id: any, patchJSON: any): Promise<any> {
    return this.http.put(SERVER_BASE_URL + '/users/' + id + '/update-account', patchJSON).toPromise();
  }

  delete(id: any): Promise<any> {
    return this.http.delete(SERVER_BASE_URL + "/users/" + id).toPromise();
  }
}
