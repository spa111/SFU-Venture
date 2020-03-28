import { ActivitiesService } from './../../services/server-apis/activities/activities.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-activity-finder-display',
  templateUrl: './activity-finder-display.component.html',
  styleUrls: ['./activity-finder-display.component.scss']
})
export class ActivityFinderDisplayComponent implements OnInit {
  contentLoaded: Boolean = false;
  result: Array<any>
  constructor( private activitiesService: ActivitiesService) { 
  }

  activitesDOM: any

  async ngOnInit() {
    var activities = await this.activitiesService.getAll();
    this.activitesDOM = activities
    this.contentLoaded = true;

    this.activitesDOM.forEach(element => {
      let date = moment(element.activity_timestamp)
      let formattedDate = date.format("MMM Do YYYY")
      console.log(formattedDate)
      element.activity_timestamp = formattedDate
    });

    var groups = new Set(this.activitesDOM.map(item => item.activity_timestamp))
    this.result = [];
    groups.forEach(g =>
      this.result.push({
        name: g, 
        values: this.activitesDOM.filter(i => i.activity_timestamp === g)
      }
    ))

    console.log(this.result)
    groups.forEach(g => console.log(g))


    console.log(activities)
  }

}
