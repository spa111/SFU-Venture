import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/server-apis/users/users.service'
declare var $:any;

@Component({
  selector: 'app-main-market-display',
  templateUrl: './main-market-display.component.html',
  styleUrls: ['./main-market-display.component.scss']
})



export class MainMarketDisplayComponent implements OnInit {
  
  
  ngOnInit() {
    this.userService.getDept().then((result) => {
      console.log(result);
      this.faculties = result;
      this.facultiesDOM = result;
    })
    .catch((err) => {
      console.log(err);
    })
  }
  
  textbooks: any;
  faculties: any;
  facultiesDOM: any;
  
  sortByDept(){
    console.log($('#filterDept')[0].value);
    let filter_value = $('#filterDept')[0].value;

    if (filter_value == "choose") {
      this.facultiesDOM = JSON.parse(JSON.stringify(this.faculties));
    } else {
      this.facultiesDOM = this.facultiesDOM.filter(filter => {
        return filter.value == filter_value; 
      });
    }
  }

  constructor(private userService: UsersService) {

    

    this.textbooks = [{
      textbookName: "Operating System Concepts, 9th Edition, Silberschatz, Galvin, Gagne, 2012",
      course: "300",
      faculty: "CMPT",
      price: "10",
      postDate: "August 23",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRdMSTfBunrwHpZlh146YZtHiH5ax1spAZKQEii9l9TJ92VrDQR"
    },
    {
      textbookName: "Programming: Principles and Practice Using C++",
      course: "130",
      faculty: "CMPT",
      price: "50",
      postDate: "August 14",
      imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRtVJT34n352gqhS5KZcW4IEjR0JqWSi2WFl95-hz5iEnu4T4Ey"

    },
    {
      textbookName: "C++ Primer (5th Edition)",
      course: "135",
      faculty: "CMPT",
      price: "15",
      postDate: "July 3",
      imageUrl: "https://image.ebooks.com/previews/001/001436/001436169/001436169.jpg"

    },
    {
      textbookName: "Data Structures and Algorithms in C++",
      course: "225",
      faculty: "CMPT",
      price: "1",
      postDate: "Feburary 14",
      imageUrl: "https://images-na.ssl-images-amazon.com/images/I/61pHgCDCgqL.jpg"
    }]

  };


}
