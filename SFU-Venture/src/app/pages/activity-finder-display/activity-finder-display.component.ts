import { TextbooksService } from './../../services/server-apis/textbooks/textbooks.service';
import { ActivitiesService } from './../../services/server-apis/activities/activities.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-activity-finder-display',
  templateUrl: './activity-finder-display.component.html',
  styleUrls: ['./activity-finder-display.component.scss']
})
export class ActivityFinderDisplayComponent implements OnInit {
  
  contentLoaded: Boolean = false;
  result: Array<any>
  activities: any
  activitesDOM: any
  faculties: any
  facultiesDom: any
  resultBackup: any
  userIsOwner: Boolean = true;
  activityId: any

  constructor( 
    private activitiesService: ActivitiesService,
    private textbooksService: TextbooksService,
    private router: Router
    ) { 
  }


  // you will have result and result_backup to use after this 
  async ngOnInit() {
    this.activities = await this.activitiesService.getAll();
    this.activitesDOM = JSON.parse(JSON.stringify(this.activities))
    this.contentLoaded = true;

    this.activitesDOM.forEach(element => {
      let date = moment(element.activity_timestamp)
      let time = moment(element.activity_timestamp)
      let formattedDate = date.format("MMM Do YYYY")
      element.activity_timestamp = formattedDate

      element.time = time.format("h:mm a");


      this.textbooksService
      .getDept()
      .then(result => {
        this.faculties = result;
        this.facultiesDom = result
        });

    });

    var groups = new Set(this.activitesDOM.map(item => item.activity_timestamp))
    this.result = [];
    groups.forEach(g =>
      this.result.push({
        name: g, 
        values: this.activitesDOM.filter(i => i.activity_timestamp === g)
      }
    ))

    this.resultBackup = JSON.parse(JSON.stringify(this.result))

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

    this.userIsOwner = item.poster_user_id == localStorage.getItem("user")
    this.activityId = item.id
 

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

    let listToUse = this.resultBackup;
    let emptyString = ""
    let startDateString = (<HTMLInputElement>document.getElementById("startDatePicker")).value;


    if (startDateString != emptyString) {
      listToUse = this.sortByDate(startDateString)
    }

    this.sortDept(listToUse)

  }

  sortByDate(startDateString) {

    let startDateMoment = moment(startDateString)
    let startDate = startDateMoment.format("YYYY-MM-DD")
    
    console.log("Start Date: ", startDate)
    var temp = JSON.parse(JSON.stringify(this.resultBackup))

    this.result = temp.filter( i => {
      let dateToCompare = moment(i.name, 'MMM Do YYYY').format('YYYY-MM-DD')
      return moment(startDate).isBefore(dateToCompare)
    })

    return this.result
  }

  sortDept(listToUse) {
    var sortedList = JSON.parse(JSON.stringify(listToUse))
    console.log($("#filterDept")[0].value);
    let filter_value = $("#filterDept")[0].value;

    if (filter_value == "All") {
      this.result = sortedList
    } else {

      sortedList.forEach(element => {

        var values = element.values.filter(item => {
          return item.corresponding_department.toUpperCase() === filter_value.toUpperCase()
        })

        element.values = values

      });

      this.result = sortedList
    }
  }

  reset() {
    this.result = JSON.parse(JSON.stringify(this.resultBackup))
    $("#filterDept")[0].value = $("#filterDept")[0][0].value
    let startDateString = (<HTMLInputElement>document.getElementById("startDatePicker"));
    startDateString.value = ""
  }

  // this.activityId is the Id of the activity currently open in modal view
  // It is set in the function "setModal()"
  async deleteActivity() {

    this.activitiesService
      .deleteActivityById(this.activityId)
      .then(result => {
        if (window.location.pathname == "/activity-finder") {
          this.redirectTo("activity-finder");
        }
      })
      .catch(err => {
        console.log(err);
      });


  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

}
