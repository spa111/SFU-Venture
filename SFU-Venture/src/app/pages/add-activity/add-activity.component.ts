import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from "../../services/server-apis/activities/activities.service";
import { Router } from "@angular/router";
import { TextbooksService } from "../../services/server-apis/textbooks/textbooks.service";

declare var $: any;
declare var google: any;

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
  faculties: any;
  placeSearch: any;
  autocomplete: any;
  // navigator: any;

  ngOnInit() {
    $(() => {
      $("#activity-form").on('submit', (event) => {
        event.preventDefault();
      });
    });

    this.initAutocomplete();

    this.textbooksService
    .getDept()
    .then(result => {
      console.log(result);
      this.faculties = result;
    })
    .catch(err => {
      console.log(err);
    });
  }

  // Places API from Google
  initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete((document.getElementById('location')), {});
    this.autocomplete.setComponentRestrictions({
      'country': ['ca']
    });

    this.autocomplete.addListener('place_changed');
  }

  geolocate() {
    if (navigator.geolocation) {
      this.autocomplete.setBounds(
        navigator.geolocation.getCurrentPosition(function(position) {
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          var circle = new google.maps.Circle({
            center: geolocation,
            radius: position.coords.accuracy
          });
          return circle.getBounds();
        })
      );
    }
  }

  // Normal Add Activity API
  createActivity() {
    console.log("createActivity called");

    let poster_user_id = localStorage.getItem('user');
    let corresponding_department = $("#filterDept")[0].value;
    let activity_title = $("#activityTitle")[0].value;
    let activity_description = $("#description")[0].value;
    let activity_price = $("#entryFee")[0].value || 0;
    let activity_location = $("#location")[0].value;
    let activity_timestamp = $("#dateTime")[0].value;
    

    let details = {
      "poster_user_id": poster_user_id,
      "corresponding_department": corresponding_department,
      "activity_title": activity_title,
      "activity_description": activity_description,
      "activity_price": activity_price,
      "activity_location": activity_location,
      "activity_timestamp": activity_timestamp,
    };

    if (poster_user_id && corresponding_department && activity_title && activity_description && activity_location) {
      this.activitiesService.createActivity(details).then(result => {
        console.log(result.response);
        this.router.navigate(['activity-finder']);

      }).catch(err => {
        console.log(err.error);
      });
    } else{
      alert("Form is not completely fill out");
    }
  } 
}