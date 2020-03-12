import { Component, OnInit, AfterViewInit } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from "@angular/router";
import { TextbooksService } from "../../services/server-apis/textbooks/textbooks.service";
declare var $: any;

@Component({
  selector: "app-main-market-display",
  templateUrl: "./main-market-display.component.html",
  styleUrls: ["./main-market-display.component.scss"]
})
export class MainMarketDisplayComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private textbooksService: TextbooksService
  ) {}

  getAllTextbooks() {
    console.log("full Texbook Retrieval called");
    this.textbooksService
      .getAll()
      .then(result => {
        console.log("Retrieval Successful");
        console.log(result);
        this.textbooks = result;
      })
      .catch(err => {
        console.log(err);
      });
  }

  ngOnInit() {
    this.getAllTextbooks();
    this.textbooksService
      .getDept()
      .then(result => {
        console.log(result);
        this.faculties = result;

        this.faculties.forEach(faculty => {
          faculty.textbooks = this.textbooks.filter(textbook => {
            return textbook.faculty_name.toLocaleLowerCase() == faculty.value;
          });
        });

        this.facultiesDOM = JSON.parse(JSON.stringify(this.faculties));
      })
      .catch(err => {
        console.log(err);
      });
  }

  textbooks: any;
  faculties: any;
  facultiesDOM: any;

  sortByDept() {
    console.log($("#filterDept")[0].value);
    let filter_value = $("#filterDept")[0].value;

    if (filter_value == "choose") {
      this.reset();
    } else {
      this.facultiesDOM = JSON.parse(JSON.stringify(this.faculties));
      this.facultiesDOM = this.facultiesDOM.filter(filter => {
        return filter.value == filter_value;
      });
    }
  }

  reset() {
    this.facultiesDOM = JSON.parse(JSON.stringify(this.faculties));
    $("#filterDept")[0].value = $("#filterDept")[0][0].value;
    console.log($("#filterDept")[0].value);
  }
  //   {
  //     textbookName: "C++ Primer (5th Edition)",
  //     course: "135",
  //     faculty: "CMPT",
  //     price: "15",
  //     postDate: "July 3",
  //     imageUrl: "https://image.ebooks.com/previews/001/001436/001436169/001436169.jpg"

  //   },
  //   {
  //     textbookName: "Data Structures and Algorithms in C++",
  //     course: "225",
  //     faculty: "CMPT",
  //     price: "1",
  //     postDate: "Feburary 14",
  //     imageUrl: "https://images-na.ssl-images-amazon.com/images/I/61pHgCDCgqL.jpg"
  //   }]
}
