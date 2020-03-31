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

  ngOnInit() {
    $(() => {
      $("#activity-form").on('submit', (event) => {
        event.preventDefault();
      });
    });

    this.textbooksService
    .getDept()
    .then(result => {
      console.log(result);
      this.faculties = result;
    })
    .catch(err => {
      console.log(err);
    });

    ///////////////////////////////// google maps \/
    var placeSearch, autocomplete;

    var componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };

    function initAutocomplete() {
      // Create the autocomplete object, restricting the search predictions to
      // geographical location types.
      autocomplete = new google.maps.places.Autocomplete(
          document.getElementById('autocomplete'), {types: ['geocode']});

      // Avoid paying for data that you don't need by restricting the set of
      // place fields that are returned to just the address components.
      autocomplete.setFields(['address_component']);

    }

    // Bias the autocomplete object to the user's geographical location,
    // as supplied by the browser's 'navigator.geolocation' object.
    function geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          var circle = new google.maps.Circle(
              {center: geolocation, radius: position.coords.accuracy});
          autocomplete.setBounds(circle.getBounds());
        });
      }
    }
    //////////////////////////////// google maps /\
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

    if (poster_user_id && corresponding_department && activity_title && activity_description && activity_price && activity_location) {
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