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
    const jsonTest = {
      coord: '49.276505,-122.921785',
      radius: '1500', 
      type: 'restaurant',
      keyword: 'chinese'
    }
    this.http.post(SERVER_BASE_URL + '/api/activityAround/' , jsonTest, this.httpOptions).toPromise();
    return this.http.get(SERVER_BASE_URL + '/api/activties', this.httpOptions).toPromise();
  }
  
  createActivity(newActivityJSON: any): Promise<any> {
    this.generateHeaders();
    return this.http.post(SERVER_BASE_URL + "/api/createActivity", newActivityJSON, this.httpOptions).toPromise();
  }

  getActivityById(id: any): Promise<any> {
    this.generateHeaders();
    return this.http.post(SERVER_BASE_URL + "/api/activity/" + id, this.httpOptions).toPromise();
  }

  deleteActivityById(id: any): Promise<any> {
    this.generateHeaders();
    return this.http.post(SERVER_BASE_URL + "/api/activity/" + id, this.httpOptions).toPromise();
  }
}

// router.get('/api/activity', cors(), activityFinder.getAllActivities);
// router.post('/api/activity', cors(), activityFinder.createActivity);
// router.get('/api/activity/:id', cors(), activityFinder.getActivityById);
// router.delete('/api/activity/:id', cors(), activityFinder.deleteActivityById);