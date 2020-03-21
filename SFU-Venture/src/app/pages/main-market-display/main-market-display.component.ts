import { Component, OnInit, AfterViewInit, Inject } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from "@angular/router";
import { TextbooksService } from "../../services/server-apis/textbooks/textbooks.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

declare var $: any;

export interface DialogData {
  textbook: any;
}

@Component({
  selector: "app-main-market-display",
  templateUrl: "./main-market-display.component.html",
  styleUrls: ["./main-market-display.component.scss"]
})
export class MainMarketDisplayComponent implements OnInit {
  contentLoaded: Boolean = false;
  courses: Array<any> = [];

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
      console.log("Retrieval Successful");
      console.log(result);
      this.textbooks = result;

      this.textbooksService
      .getDept()
      .then(result => {
        this.faculties = result;

        this.faculties.forEach(faculty => {
          faculty.textbooks = this.textbooks && this.textbooks.length > 0 ? this.textbooks.filter(textbook => {
            return textbook.faculty_name.toLocaleLowerCase() == faculty.value;
          }) : [];
        });

        this.facultiesDOM = JSON.parse(JSON.stringify(this.faculties));
        this.contentLoaded = true;
      })
      .catch(err => {
        console.log(err);
      });
    }).catch(err => { 
      console.log(err)
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
  }

  textbooks: any;
  faculties: any;
  facultiesDOM: any;

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
    
    // Checking price ranges set
    if (lowerPriceInput && higherPriceInput) {
      this.shouldSortPrice = true;
      let price1 = parseInt(lowerPriceInput);
      let price2 = parseInt(higherPriceInput);

      // Check if the user swapped the min and max values
      if (price1 > price2) {
        this.priceRangeLowerBound = price2;
        this.priceRangeLowerBound = price1;
      } else {
        this.priceRangeLowerBound = price1;
        this.priceRangeHigherBound = price2;
      }
    } else {
      this.shouldSortPrice = false;
    }

    // Gather checked field for Dept
    let deptFilterVvalue = $("#filterDept")[0].value;

    // Check if the dept filter value was set
    if (deptFilterVvalue != "All") {
      this.shouldSortDept = true;
      this.deptFilterVal = deptFilterVvalue;
    } else {
      this.shouldSortDept = false;
    }

    // Gather checked field for Course
    let courseFilterValue = $("#filterClass")[0].value;

    // Check if the course filter value was set
    if (deptFilterVvalue != "ALL") {
      this.shouldSortClass = true;
      this.courseFilterVal = courseFilterValue;
    } else {
      this.shouldSortClass = false;
    }
  }

  filter() {
    this.checkFiltersSet();

    if (this.shouldSortPrice || this.shouldSortDept || this.shouldSortClass) {
      this.facultiesDOM = JSON.parse(JSON.stringify(this.faculties));
    
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
    this.facultiesDOM = JSON.parse(JSON.stringify(this.faculties));

    // Reset the price filter
    $("#lower-price")[0].value = "";
    $("#higher-price")[0].value = "";
    this.shouldSortPrice = false;

    // Reset the Dept filter to the "ALL" option
    $("#filterDept")[0].value = $("#filterDept")[0][0].value;
    this.shouldSortDept = false;

    // Reset the class filter to the "ALL" option
    $("#filterClass")[0].value = $("#filterClass")[0][0].value;
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
      console.log('The dialog was closed');
      console.log(result);      
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
}

@Component({
  selector: 'main-market-book-information',
  templateUrl: 'main-market-book-information.html',
  styleUrls: ["./main-market-display.component.scss"]
})

export class MainMarketBookInfoDialog {
  textbook: any = {};

  constructor(public dialogRef: MatDialogRef<MainMarketBookInfoDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.textbook = Object.assign({}, this.data.textbook);
    console.log(this.textbook);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}