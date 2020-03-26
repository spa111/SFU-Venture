import { Component, OnInit, HostListener, AfterViewInit, Inject } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from "@angular/router";
import { TextbooksService } from "../../services/server-apis/textbooks/textbooks.service";
import { UsersService } from "../../services/server-apis/users/users.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

declare var $: any;

export interface DialogData {
  textbook: any;
}

export interface BookDeleteData {
  textbook: any;
  textbookDeleted: Boolean;
}

export interface ContactSellerData {
  textbook: any;
  messageSent: Boolean;
}

@Component({
  selector: "app-main-market-display",
  templateUrl: "./main-market-display.component.html",
  styleUrls: ["./main-market-display.component.scss"]
})
export class MainMarketDisplayComponent implements OnInit {
  contentLoaded: Boolean = false;
  courses: Array<any> = [];
  deptWithTextbooks: Array<any> = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private textbooksService: TextbooksService,
    public dialog: MatDialog
  ) {}

  getAllTextbooks(): Promise<any> {
    console.log("full Texbook Retrieval called");
    return this.textbooksService.getAll();
  }

  ngOnInit() {
    this.getAllTextbooks().then(result => {
      this.textbooks = result;

      this.textbooksService
      .getDept()
      .then(result => {
        console.log("Retrieval Successful");
        console.log(result);
        this.faculties = result;

        this.faculties.forEach(faculty => {
          faculty.textbooks = this.textbooks && this.textbooks.length > 0 ? this.textbooks.filter(textbook => {
            return textbook.faculty_name.toLocaleLowerCase() == faculty.value;
          }) : [];

          if (faculty.textbooks.length > 0) {
            this.deptWithTextbooks.push(faculty)
          }
        });

        this.facultiesDOM = JSON.parse(JSON.stringify(this.deptWithTextbooks));
        this.contentLoaded = true;
      })
      .catch(err => {
        console.log(err);
      });
    }).catch(err => { 
      console.log(err)
    });
  }

  coursesArray: any;
  coursesSort: any;
  textbooks: any;
  faculties: any;
  facultiesDOM: any;
  facultiesSort: any;

  shouldSortPrice: Boolean = false;
  shouldSortDept: Boolean = false;
  shouldSortClass: Boolean = false;

  priceRangeLowerBound: any = 0;
  priceRangeHigherBound: any = 0;
  deptFilterVal: String = "";
  courseFilterVal: String = "";

  checkFiltersSet() {
    // Gather checked fields for min - max
    let lowerPriceInput = $("#lower-price")[0].value;
    let higherPriceInput = $("#higher-price")[0].value;

    let defaultMin = 0;
    let defaultMax = 10000
    
    // Checking price ranges set
    if (lowerPriceInput || higherPriceInput) {
      this.shouldSortPrice = true;
      let price1 = defaultMin;
      let price2 = defaultMax;

      if (lowerPriceInput != '') {
        price1 = parseInt(lowerPriceInput);
      }

      if (higherPriceInput != '') {
        price2 = parseInt(higherPriceInput);
      }


      // Check if the user swapped the min and max values
      if (price1 > price2) {
        this.priceRangeLowerBound = price2;
        this.priceRangeHigherBound = price1;
      } else {
        this.priceRangeLowerBound = price1;
        this.priceRangeHigherBound = price2;
      }
    } else {
      this.shouldSortPrice = false;
    }

    // Gather checked field for Dept
    console.log(this.Selector)
    let deptFilterValue = this.Selector.toLowerCase();

    // Check if the dept filter value was set
    if (deptFilterValue != "all") {
      this.shouldSortDept = true;
      this.deptFilterVal = deptFilterValue;
    } else {
      this.shouldSortDept = false;
    }

    // Gather checked field for Course
    console.log(this.Course)
    let courseFilterValue = this.Course.toLowerCase();

    // Check if the course filter value was set
    if (courseFilterValue != "---") {
      this.shouldSortClass = true;
      this.courseFilterVal = courseFilterValue;
    } else {
      this.shouldSortClass = false;
    }
  }

  filter() {
    this.checkFiltersSet();

    if (this.shouldSortPrice || this.shouldSortDept || this.shouldSortClass) {
      this.facultiesDOM = JSON.parse(JSON.stringify(this.deptWithTextbooks));
    
      if (this.shouldSortPrice) {
        this.sortByPrice();
      }
  
      if (this.shouldSortDept) {
        this.sortByDept();
      }
  
      if (this.shouldSortClass) {
        this.sortByCourse();
      }
    } else {
      this.reset();
    }
  }

  sortByPrice() {
    console.log("called")
    this.facultiesDOM = this.facultiesDOM.filter(filter => {
      let textbooks = filter.textbooks;
      if (textbooks.length == 0) {
        return false;
      }

      let filteredTextbooks = textbooks.filter(textbook => {
        // Extract the price with the $
        let price = parseFloat(textbook.price.slice(1, textbook.price.length));
        return (price >= this.priceRangeLowerBound) && (price <= this.priceRangeHigherBound);
      });

      filter.textbooks = filteredTextbooks;
      return filteredTextbooks.length ? true : false;
    });
  }

  sortByDept() {
    this.facultiesDOM = this.facultiesDOM.filter(filter => {
      return filter.value == this.deptFilterVal;
    });
  }

  sortByCourse() {
    this.facultiesDOM = this.facultiesDOM.filter(filter => {
      let textbooks = filter.textbooks;
      if (textbooks.length == 0) {
        return false;
      }

      let filteredTextbooks = textbooks.filter(textbook => {
        return textbook.course_name == this.courseFilterVal;
      });

      filter.textbooks = filteredTextbooks;
      return filteredTextbooks.length ? true : false;
    });
  }

  reset() {
    this.facultiesDOM = JSON.parse(JSON.stringify(this.deptWithTextbooks));

    // Reset the price filter
    $("#lower-price")[0].value = "";
    $("#higher-price")[0].value = "";
    this.shouldSortPrice = false;

    // Reset the Dept filter to the "ALL" option
    // $("#filterDept")[0].value = $("#filterDept")[0][0].value;
      this.Selector = "ALL";
    this.shouldSortDept = false;

    // Reset the class filter to the "ALL" option
    // $("#filterClass")[0].value = $("#filterClass")[0][0].value;
      this.Course = "";
    this.shouldSortClass = false;
  }

  openTextbookInfo(clicked_textbook) {
    const dialogRef = this.dialog.open(MainMarketBookInfoDialog, {
      width: '50%',
      height: '400px',
      data: {
        textbook: clicked_textbook
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("textbook dialog closed");
    });
  }

  // Example Textbooks for testing
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
        this.coursesArray = result;
      })
      .catch(err => {
        console.log(err);
      });
    }
      $(".placeholderCourse").css("opacity", "1");
    this.filter();
  }

  selectorCourse() {
    if (this.SelectorOpen == true) {
      return;
    }
    this.SelectorOpen = true;
    this.coursesSort = this.coursesArray;
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
    this.filter();
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


// The textbook details Modal Dialog
@Component({
  selector: 'main-market-book-information',
  templateUrl: 'main-market-book-information.html',
  styleUrls: ["./main-market-display.component.scss"]
})

export class MainMarketBookInfoDialog {
  textbook: any = {};
  user_owns_posting: Boolean = false;
  adminOverride: Boolean = false;

  constructor(
    public dialogRef: MatDialogRef<MainMarketBookInfoDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog,
    private router: Router
  ) {

    this.textbook = Object.assign({}, this.data.textbook);
    this.textbook.description = this.textbook.description != "" ? this.textbook.description : "No Description Provided";

    // Override to allow admin user full control over marketplace posts
    if (this.router.url == "/admin-control") {
      this.adminOverride = true;
    }

    this.user_owns_posting = this.textbook.posting_user_id == localStorage.getItem('user') ? true : this.adminOverride ? true : false;
  }

  onCloseClick(): void {
    this.dialogRef.close({
      textbookDeleted: false
    });
  }

  contactSeller() {
    const contactSellerDialogRef = this.dialog.open(ContactSellerDialog, {
      width: '75%',
      height: '80%',
      data: {
        textbook: this.textbook,
        messageSent: false
      }
    });

    contactSellerDialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`Message sent = ${result.data.messageSent}`);
      }
    });
  }

  deletePosting() {
    const deleteDialogRef = this.dialog.open(PostingDeleteConfirmationDialog, {
      width: '30%',
      height: '200px',
      data: {
        textbook: this.textbook,
        textbookDeleted: false
      }
    });

    deleteDialogRef.afterClosed().subscribe(result => {
      if (result && result.data.textbookDeleted) {
        this.dialogRef.close({
          textbookDeleted: true
        });
      } else {
        this.dialogRef.close({
          textbookDeleted: false
        });
      }
    });
  }
}


// The Contact Seller Modal Dialog
@Component({
  selector: 'contact-seller',
  templateUrl: 'posting-contact-seller.html',
  styleUrls: ["./main-market-display.component.scss"]
})

export class ContactSellerDialog {
  constructor(
    public dialogRef: MatDialogRef<ContactSellerDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: ContactSellerData,
    public dialog: MatDialog,
    private usersService: UsersService
  ) {
    this.data.messageSent = false;
  }

  onCloseClick(): void {
    this.dialogRef.close({
      data: this.data
    });
  }

  sendMessage() {
    let message = $("#message")[0].value;

    if (message == "") {
      message = "Hi there. I would like to talk about purchasing this textbook. Please send me an email if it is still available. <br><br> Thanks"
    } 

    let payload = {
      "buyerId" : localStorage.getItem('user'),
      "sellerId" : this.data.textbook.posting_user_id,
      "message": message,
      "textbook": this.data.textbook
    };

    this.usersService.emailSellerAndBuyer(payload).then(result => {
      console.log(result);
      this.data.messageSent = true;

      this.dialogRef.close({
        data: this.data
      });

    }).catch(err => {
      console.log(err);
    });
    
  }
}


// Posting Delete Modal
@Component({
  selector: 'posting-delete-confirmation',
  templateUrl: 'posting-delete-confirmation.html',
  styleUrls: ["./main-market-display.component.scss"]
})

export class PostingDeleteConfirmationDialog {
  textbook: any = {};

  constructor(
    public dialogRef: MatDialogRef<PostingDeleteConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: BookDeleteData,
    private textbooksService: TextbooksService,
    private router: Router
  ) {
    this.textbook = Object.assign({}, this.data.textbook);
  }

  onCloseClick() {
    this.data.textbookDeleted = false;
    this.dialogRef.close({
      data: this.data
    });
  }

  deletePosting() {
    // Need to implement deletion here
    this.textbooksService.deleteTextbookPosting(this.textbook.id).then(result => {

      if (window.location.pathname == "/market") {
        this.redirectTo('market');
      }
    }).catch((err) => {
      console.log(err);
    });


    this.data.textbookDeleted = true;
    this.dialogRef.close({
      data: this.data
    });
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
  }
}