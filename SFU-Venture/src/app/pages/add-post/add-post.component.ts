import { ChangeDetectorRef, Component, OnInit, AfterViewInit } from "@angular/core";
import { TextbooksService } from "../../services/server-apis/textbooks/textbooks.service";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";

declare var $: any;

@Component({
  selector: "app-add-post",
  templateUrl: "./add-post.component.html",
  styleUrls: ["./add-post.component.scss"]
})
export class AddPostComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private textbooksService: TextbooksService,
    private cdr: ChangeDetectorRef
  ) {}

  faculties: any;
  courses: any;
  books: any;
  imageURL: any;
  userEnteringBook: Boolean = false;

  ngOnInit() {
    $(() => {
      $("#textbook-form").on("submit", event => {
        event.preventDefault();
      });

      $("#filterDept")[0].addEventListener("change", () => {
        let dept = $("#filterDept")[0].value;
        this.imageURL = "";
        this.books = [];

        this.textbooksService.getCourses(dept).then(result => {
          this.courses = result;
          this.cdr.detectChanges();

        }).catch(err => {
          console.log(err);
        });
      });
      
      $("#course")[0].addEventListener("change", () => {
        this.imageURL = "";

        let json = {
          "year": "2020",
          "term": "spring",
          "course": $("#filterDept")[0].value,
          "courseNumber": $("#course")[0].value
        };

        this.textbooksService.getTextbooksByCourse(json).then(result => {
          this.books = result.searchResults;
          this.cdr.detectChanges();
          
          this.books.forEach(textbook => {
            let details = textbook.details;
            var tmp = document.createElement("DIV");
            tmp.innerHTML = details;
            
            let textbookDetails = tmp.textContent || tmp.innerText;
            textbook.details = textbookDetails.replace(/(\r\n|\n|\r)/gm, "");
          });
        }).catch(err => {
          this.books = [];
          console.log("No books required for this course");
        });
      });

      $("#chooseBook")[0].addEventListener("change", event => {
        if(event.target.value == "UserEntered") {
          this.userEnteringBook = true;
          this.imageURL = "";

        } else {
          this.userEnteringBook = false;

          let isbnOBJ = this.books && this.books.filter(book => {
            return book.details == event.target.value;
          });

          if (isbnOBJ && isbnOBJ[0]) {
            let json = {
              "isbn": isbnOBJ[0].isbn,
              "size": "l"
            };

            this.textbooksService.getTextbooksCover(json).then(result => {
              console.log(result);
              this.imageURL = result;
            }).catch(err => {
              console.log(err);
            });

          } else {
            this.imageURL = "";
          }
        }
      });

      $("#URL")[0].addEventListener('change', event => {
        this.imageURL = event.target.value;
      });
    });

    this.textbooksService.getDept().then(result => {
      this.faculties = result;
    }).catch(err => {
      console.log(err);
    });
  }

  createTextbook() {
    let textbookName = this.userEnteringBook ? $("#textbook-name")[0].value : $("#chooseBook")[0].value
    let dept = $("#filterDept")[0].value;
    let course = $("#course")[0].value;
    let price = $("#price")[0].value;
    let url = $("#URL")[0].value;
    let description = $("#description-info")[0].value || "";
    let date = new Date();

    let details = {
      user_id: localStorage.getItem("user"),
      txt_book_name: textbookName,
      course_name: course,
      faculty_name: dept,
      price: price,
      post_date: date,
      img_url: url,
      description: description
    };

    if (textbookName && course && price && dept && url) {
      this.textbooksService
        .addNewTextbook(details)
        .then(result => {
          console.log(result.response);
          this.router.navigate(["market"]);
        })
        .catch(err => {
          console.log(err.error);
        });
    } else {
      alert("Please fill out all fields")
      console.log("form not fully filled out");
    }
  }
}
