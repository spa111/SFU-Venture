import { TextbooksService } from './../../services/server-apis/textbooks/textbooks.service';
import { ActivitiesService } from './../../services/server-apis/activities/activities.service';
import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UsersService } from 'src/app/services/server-apis/users/users.service';

declare var $: any;

export interface ActivityItem {
  activity: any;
}

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
    private router: Router,
    public dialog: MatDialog
    ) { 
  }


  // you will have result and result_backup to use after this 
  ngOnInit() {
    this.generateActivities();
  }
  generateActivities() {
    this.activitiesService.getAll().then(result => {
      this.activities = result;
      this.activitesDOM = JSON.parse(JSON.stringify(this.activities))
      this.activitesDOM.forEach(element => {

        let date = moment(element.activity_timestamp);
        let time = moment(element.activity_timestamp);
        let formattedDate = date.format("MMM Do YYYY");
        element.activity_timestamp = formattedDate;
        element.time = time.format("h:mm a");
        element.color =  (Math.floor(Math.random() * (7 - 1) + 1));

        if (element.activity_price == "$0.00") {
          element.activity_price = "Free";
        }

        this.textbooksService.getDept().then(result => {
          this.faculties = result;
          this.facultiesDom = result;

          var groups = new Set(this.activitesDOM.map(item => item.activity_timestamp))
          this.result = [];
          groups.forEach(g =>
            this.result.push({
              name: g, 
              values: this.activitesDOM.filter(i => i.activity_timestamp === g)
            }
          ));


          this.sortDates();
          this.resultBackup = JSON.parse(JSON.stringify(this.result));
          this.contentLoaded = true;
        });
      });
    }).catch(err => {
      console.log(err);
    });
  }

  openModal(activityItem) {
    const activityDialog = this.dialog.open(ActivityModalDialog, {
      width: "55%",
      height: "70%",
      data: {
        activity: activityItem
      }
    });

    activityDialog.afterClosed().subscribe(result => {
      if (result && result.activityDeleted) {
        this.generateActivities();
      }
    });
  }
  
  sort() {
    let listToUse = this.resultBackup;
    let emptyString = "";
    let startDateString = (<HTMLInputElement>document.getElementById("startDatePicker")).value;

    if (startDateString != emptyString) {
      listToUse = this.sortByDate(startDateString);
    }

    this.sortDept(listToUse);
  }

  sortDates() {
    this.result.sort((a, b) => {
      let a_date_split = a.name.split(' ');
      let b_date_split = b.name.split(' ');

      // Remove the st, nd, rd, and th suffix from the day
      if (a_date_split[1].length == 3) {
        a_date_split[1] = a_date_split[1].substring(0,1);
      } else {
        a_date_split[1] = a_date_split[1].substring(0,2);
      }

      if (b_date_split[1].length == 3) {
        b_date_split[1] = b_date_split[1].substring(0,1);
      } else {
        b_date_split[1] = b_date_split[1].substring(0,2);
      }

      let a_dateString = `${a_date_split[0]} ${a_date_split[1]} ${a_date_split[2]}`;
      let b_dateString = `${b_date_split[0]} ${b_date_split[1]} ${b_date_split[2]}`;

      let a_datetime = new Date(a_dateString).getTime();
      let b_datetime = new Date(b_dateString).getTime();

      return a_datetime - b_datetime;
    });
  }

  sortByDate(startDateString) {
    let startDateMoment = moment(startDateString);
    let startDate = startDateMoment.format("YYYY-MM-DD");
    
    console.log("Start Date: ", startDate);
    var temp = JSON.parse(JSON.stringify(this.resultBackup));

    this.result = temp.filter( i => {
      let dateToCompare = moment(i.name, 'MMM Do YYYY').format('YYYY-MM-DD');
      return moment(startDate).isBefore(dateToCompare);
    });

    return this.result;
  }

  sortDept(listToUse) {
    var sortedList = JSON.parse(JSON.stringify(listToUse));
    console.log($("#filterDept")[0].value);
    let filter_value = $("#filterDept")[0].value;

    if (filter_value == "All") {
      this.result = sortedList;
    } else {

      sortedList.forEach(element => {
        var values = element.values.filter(item => {
          return item.corresponding_department.toUpperCase() === filter_value.toUpperCase()
        })
        element.values = values
      });

      this.result = sortedList;
    }
  }

  reset() {
    this.result = JSON.parse(JSON.stringify(this.resultBackup));
    $("#filterDept")[0].value = $("#filterDept")[0][0].value;
    let startDateString = (<HTMLInputElement>document.getElementById("startDatePicker"));
    startDateString.value = "";
  }
}

// The textbook details Modal Dialog
@Component({
  selector: "activity-modal",
  templateUrl: "activity-modal.html",
  styleUrls: ["./activity-finder-display.component.scss"]
})
export class ActivityModalDialog {
  activity: any;
  adminOverride: Boolean = false;
  user_owns_posting: Boolean = false;

  activity_title: any;
  activity_description: any;
  activity_timestamp: any;
  time: any;
  activity_location: any;
  activity_price: any;

  constructor(
    public dialogRef: MatDialogRef<ActivityModalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ActivityItem,
    public dialog: MatDialog,
    private router: Router,
    private activitiesService: ActivitiesService,
    private usersService: UsersService
  ) {

    this.activity = this.data.activity;

    if (this.router.url == "/admin-control") {
      this.adminOverride = true;
    }

    this.activity_title = this.activity.activity_title;
    this.activity_description = this.activity.activity_description;
    this.activity_timestamp = this.activity.activity_timestamp;
    this.time = this.activity.time;
    this.activity_location = this.activity.activity_location;
    this.activity_price = this.activity.activity_price == "$0.00" ? "Free" : this.activity.activity_price;

    this.user_owns_posting = this.activity.poster_user_id == localStorage.getItem("user") || this.adminOverride;
  }

  closeModal(): void {
    this.dialogRef.close({
      activityDeleted: false
    });
  }

  deleteActivity() {
    console.log("Need to handle deleting the post");
    this.activitiesService.deleteActivityById(this.activity.id).then(result => {
      this.dialogRef.close({
        activityDeleted: true
      });

    }).catch(err => {
      console.log(err);
    });
  }
  
}

