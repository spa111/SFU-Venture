import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_BASE_URL } from '../../../constants';

@Injectable({
  providedIn: 'root'
})
export class TextbooksService {
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
    const jsonTest = {
      coord: '49.276505,-122.921785',
      radius: '1500', 
      type: 'restaurant',
      keyword: 'chinese'
    }
    this.http.post(SERVER_BASE_URL + '/api/activityAround/' , jsonTest, this.httpOptions).toPromise();
    return this.http.get(SERVER_BASE_URL + '/api/textbooks', this.httpOptions).toPromise();
  }

  getDept(): Promise<any> {
    return this.http.get('http://www.sfu.ca/bin/wcm/academic-calendar?2020/summer/courses').toPromise();
  }

  getCourses(course: any): Promise<any> {
    return this.http.get("http://www.sfu.ca/bin/wcm/academic-calendar?2020/summer/courses/" + course).toPromise();
  }
  
  addNewTextbook(newTextbookJSON: any): Promise<any> {
    this.generateHeaders();
    return this.http.post(SERVER_BASE_URL + "/api/createTextbook", newTextbookJSON, this.httpOptions).toPromise();
  }
}
