import { ActivitiesService } from './../../services/server-apis/activities/activities.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity-finder-display',
  templateUrl: './activity-finder-display.component.html',
  styleUrls: ['./activity-finder-display.component.scss']
})
export class ActivityFinderDisplayComponent implements OnInit {
  contentLoaded: Boolean = false;
  
  constructor( private activitiesService: ActivitiesService) { 
  }

  activitesDOM: any

  async ngOnInit() {
    var activities = await this.activitiesService.getAll();
    this.activitesDOM = activities
    this.contentLoaded = true;

    console.log(activities)
  }

}
