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
      let time = moment(element.activity_timestamp)
      let formattedDate = date.format("MMM Do YYYY")
      element.activity_timestamp = formattedDate

      element.time = time.format("h:mm a");

    });

    var groups = new Set(this.activitesDOM.map(item => item.activity_timestamp))
    this.result = [];
    groups.forEach(g =>
      this.result.push({
        name: g, 
        values: this.activitesDOM.filter(i => i.activity_timestamp === g)
      }
    ))

    // console.log(this.result)
    groups.forEach(g => console.log(g))


    // console.log(activities)
  }

  setModal(item) {
    var title = document.getElementById("activityModalTitle");
    title.innerHTML = item.activity_title

    var desc = document.getElementById("activityModalDesc")
    desc.innerHTML = item.activity_description

    var when = document.getElementById("activityModalDate")
    when.innerHTML += item.activity_timestamp

    var time = document.getElementById("activityModalTime")
    time.innerHTML += item.time

    var where = document.getElementById("activityModalLocation")
    where.innerHTML += item.activity_location

    var price = document.getElementById("activityModalPrice")
    price.innerHTML += item.activity_price

  }

  openModal(item) {
    console.log(item)
    var modal = document.getElementById("activityModal")
    modal.style.display = "block"
    modal.style.backgroundColor = "#0000006e"
    this.setModal(item)
  }

  closeModal() {
    var modal = document.getElementById("activityModal")
    modal.style.display = "none"

    this.clearModal()
  }

  clearModal() {
    let emptyString = ""
    var title = document.getElementById("activityModalTitle");
    title.innerHTML = emptyString 

    var desc = document.getElementById("activityModalDesc")
    desc.innerHTML = emptyString

    var when = document.getElementById("activityModalDate")
    when.innerHTML = "<b> When: </b>"

    var time = document.getElementById("activityModalTime")
    time.innerHTML = "<b> When: </b>"

    var where = document.getElementById("activityModalLocation")
    where.innerHTML = "<b> Where: </b>"

    var price = document.getElementById("activityModalPrice")
    price.innerHTML = "<b> Price: </b>"
  }

  sort() {
    let emptyString = ""
    let startDateString = (<HTMLInputElement>document.getElementById("startDatePicker")).value;

    if (startDateString === emptyString) {
      alert("Invalid Dates")
      return;
    }

    let startDateMoment = moment(startDateString)
    let startDate = startDateMoment.format("MMM Do YYYY")


    console.log("Start Date: ", startDate)
    this.result = this.result.filter( i => {
      console.log(i)
      console.log(i.name >= startDate)
      return i.name >= startDate
    })











  }

}
