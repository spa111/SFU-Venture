import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from "../../services/server-apis/activities/activities.service";
import { Router } from "@angular/router";
import { TextbooksService } from "../../services/server-apis/textbooks/textbooks.service";

declare var $: any;

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.scss']
})
export class AddActivityComponent implements OnInit {

  constructor(
    private router: Router,
    private activitiesService: ActivitiesService,
    private textbooksService: TextbooksService
  ) {}

  courses: any;

  ngOnInit() {
    $("#filterDept")[0].addEventListener("change", () => {
      let dept = $("#filterDept")[0].value;
      this.textbooksService.getCourses(dept)
        .then((result) => {
          this.courses = result;
        })
        .catch(err => {
          console.log(err);
        }
      );
    });
  }

  createActivity() {
    console.log("createActivity called");

    // id
    let poster_user_id = localStorage.getItem('user');
    let corresponding_department = $("#filterDept")[0].value;
    let activity_title = $("#activityTitle")[0].value;
    let activity_description = $("#description")[0].value;
    let activity_price = $("#entryFee")[0].value; // TODO (- CHANGE TO _ IN PG)
    let activity_location = $("#location")[0].value;
    // let activity_date_time = $("#dateTime")[0].value; TODO (ADD)
    let activity_timestamp = new Date(); // TODO (- CHANGE TO _ IN PG)
    
    
    let details = {
      "poster_user_id": poster_user_id,
      "corresponding_department": corresponding_department,
      "activity_title": activity_title,
      "activity_description": activity_description,
      "activity_price": activity_price,
      "activity_location": activity_location,
      // "activity_date_time": activity_date_time,
      // "activity_timestamp": activity_timestamp,
    };

    if (poster_user_id && corresponding_department && activity_title && activity_description && activity_price && activity_location) {
      this.activitiesService.createActivity(details).then(result => {
        console.log(result.response);
        this.router.navigate(['activity-finder']);

      }).catch(err => {
        console.log(err.error);
      });
    } else{
      console.log("form not fully filled out");
    }
  }

}
