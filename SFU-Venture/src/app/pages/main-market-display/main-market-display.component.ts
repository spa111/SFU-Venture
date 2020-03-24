import { Component, HostListener, OnInit, AfterViewInit } from "@angular/core";
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
  contentLoaded: Boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private textbooksService: TextbooksService
  ) {}

  getAllTextbooks(): Promise<any> {
    console.log("full Texbook Retrieval called");
    return this.textbooksService.getAll();
    // this.textbooksService
    //   .getAll()
    //   .then(result => {
    //     console.log("Retrieval Successful");
    //     console.log(result);
    //     this.textbooks = result;
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  ngOnInit() {
    this.getAllTextbooks()
      .then(result => {
        console.log("Retrieval Successful");
        console.log(result);
        this.textbooks = result;

        this.textbooksService
          .getDept()
          .then(result => {
            this.faculties = result;

            this.faculties.forEach(faculty => {
              faculty.textbooks =
                this.textbooks && this.textbooks.length > 0
                  ? this.textbooks.filter(textbook => {
                      return (
                        textbook.faculty_name.toLocaleLowerCase() ==
                        faculty.value
                      );
                    })
                  : [];
            });

            this.facultiesDOM = JSON.parse(JSON.stringify(this.faculties));
            this.contentLoaded = true;
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  courses: any;
  coursesSort: any;
  textbooks: any;
  faculties: any;
  facultiesDOM: any;
  facultiesSort: any;

  sortByDept() {
    let filter_value = this.Selector.toLowerCase();
    console.log(this.Selector)
    // let filter_value = this.Selector;

    if (filter_value == "all") {
      this.reset();
    } else {
      this.facultiesDOM = JSON.parse(JSON.stringify(this.faculties));
      this.facultiesDOM = this.facultiesDOM.filter(filter => {
        return filter.value == filter_value;
      });
    }
  }

  reset() {
    this.Selector = "ALL";
    this.Course = "";
    this.facultiesDOM = JSON.parse(JSON.stringify(this.faculties));
  }

  //-------------Section for UI Factuly and course chooser//

  Selected: Boolean = false;
  Selector: string = "ALL";
  SelectedCourse: Boolean = false;
  SelectorOpen: Boolean = false;
  Course: string = "";

  selector() {
    if (this.SelectorOpen == true) {
      return;
    }
    this.SelectorOpen = true;
    this.facultiesSort = this.faculties;
    this.currString = "";
    this.Selected = true;
    $(".placeholder").css("opacity", "0");
    $(".list__ul").css("display", "block");
    $(".placeholderCourse").css("opacity", "0");
  }

  selected(event: any): void {
    if (event.target.name == null) {
      return;
    }

    $(".placeholder").css("opacity", "1");
    this.Selector = event.target.name.toUpperCase();
    $(".list__ul").css("display", "none");
    this.Selected = false;
    this.Course = "---";
    this.SelectorOpen = false;

    if(!(event.target.name == "ALL")){

      this.textbooksService
      .getCourses(event.target.name)
      .then(result => {
        this.courses = result;
      })
      .catch(err => {
        console.log(err);
      });
    }
      $(".placeholderCourse").css("opacity", "1");
    this.sortByDept();
  }

  selectorCourse() {
    if (this.SelectorOpen == true) {
      return;
    }
    this.SelectorOpen = true;
    this.coursesSort = this.courses;
    this.currStringCourse = "";

    this.SelectedCourse = true;
    $(".placeholderCourse").css("opacity", "0");
    $(".list__ul_course").css("display", "block");
  }

  selectedCourse(event: any): void {
    $(".placeholder").css("opacity", "1");
    $(".list__ul").css("display", "none");
    if (event.target.name == null) {
      return;
    }

    $(".placeholderCourse").css("opacity", "1");
    this.Course = event.target.name.toUpperCase();
    $(".list__ul_course").css("display", "none");
    this.SelectedCourse = false;
    this.SelectorOpen = false;
  }

  currString: string = "";
  currStringCourse: string = "";
  @HostListener("document:keypress", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.Selected) {
      this.currString += event.key;

      this.facultiesSort = this.faculties.filter(faculty => {
        return faculty.value.startsWith(this.currString);
      });
    } else if (this.SelectedCourse) {
      this.currStringCourse += event.key;

      this.coursesSort = this.courses.filter(courses => {
        return courses.value.startsWith(this.currStringCourse);
      });
    }
  }
  //-------------END Section for UI Factuly and course chooser//
}
