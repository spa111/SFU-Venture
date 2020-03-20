import { Component, OnInit, AfterViewInit } from "@angular/core";
import { TextbooksService } from "../../services/server-apis/textbooks/textbooks.service";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";

declare var $: any;

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private textbooksService: TextbooksService) { }

    faculties: any;
    courses: any;

  ngOnInit() {
    $(() => {
      $("#textbook-form").on('submit', (event) => {
        event.preventDefault();
      });

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
    });

    this.textbooksService
      .getDept()
      .then(result => {
        console.log(result);
        this.faculties = result;
      })
      .catch(err => {
        console.log(err);
      }
    );
  }

  createTextbook() {
    console.log("createTextbook called");

    let textbookName = $("#textbookName")[0].value;
    let dept = $("#filterDept")[0].value;
    let course = $("#course")[0].value;
    let price = $("#price")[0].value;
    let url = $("#URL")[0].value;
    let date = new Date();

    let details = {
      "user_id": localStorage.getItem("user"),
      "txt_book_name": textbookName,
      "course_name": course,
      "faculty_name": dept,
      "price": price,
      "post_date": date,
      "img_url": url,
    };

    if (textbookName && course && price && dept && url) {
      this.textbooksService.addNewTextbook(details).then(result => {
        console.log(result.response);
        this.router.navigate(['market']);

      }).catch(err => {
        console.log(err.error);
      });
    } else{
      console.log("form not fully filled out");
    }
  }

}
