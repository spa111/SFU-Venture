import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_BASE_URL } from '../../../constants';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
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
    return this.http.get(SERVER_BASE_URL + '/api/activity', this.httpOptions).toPromise();
  }
  
  createActivity(newActivityJSON: any): Promise<any> {
    this.generateHeaders();
    return this.http.post(SERVER_BASE_URL + "/api/createActivity", newActivityJSON, this.httpOptions).toPromise();
  }

  getUserActivities(id: any): Promise<any> {
    this.generateHeaders();
    return this.http.get(SERVER_BASE_URL + "/api/activity/" + id, this.httpOptions).toPromise();
  }

  deleteActivityById(id: any): Promise<any> {
    this.generateHeaders();
    return this.http.delete(SERVER_BASE_URL + "/api/activity/" + id, this.httpOptions).toPromise();
  }
}