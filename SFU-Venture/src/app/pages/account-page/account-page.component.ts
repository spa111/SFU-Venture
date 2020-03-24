import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/server-apis/users/users.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainMarketBookInfoDialog } from '../main-market-display/main-market-display.component';
import { TextbooksService } from '../../services/server-apis/textbooks/textbooks.service';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {
  user: any;
  accessLevel: any;
  userRetrieved: Boolean = false;

  constructor(private usersService: UsersService, private router: Router, public dialog: MatDialog) {
    this.usersService.getById(localStorage.getItem('user')).then(result => {
      this.user = JSON.parse(JSON.stringify(result[0]));

      if (this.user.is_admin) {
        this.accessLevel = "Administrator";
      } else if (this.user.is_faculty && this.user.is_faculty_verified) {
        this.accessLevel = "Faculty";
      } else {
        this.accessLevel = "Student";
      }

      this.userRetrieved = true;
    }).catch(err => {
      console.log(err);
    });
  }

  ngOnInit() {
  }

  editAccountDetails() {
    this.router.navigate(['edit-account-details']);
  }

  changePassword() {
    this.router.navigate(['change-account-password']);
  }

  viewMarketPosts() {
    this.dialog.open(ViewMarketPostsDialog, {
      width: '80%',
      height: '70%'
    });
  }

  deleteAccount() {
    const deleteDialogRef = this.dialog.open(AccountDeleteConfirmationDialog, {
      width: '30%',
      height: '200px',
      data: {
        needsToDelete: false
      }
    });

    deleteDialogRef.afterClosed().subscribe(result => {
      if (result.needsToDelete) {
        this.usersService.delete(localStorage.getItem('user')).then(result => {
          this.router.navigate(['logout']);
        }).catch(err => {
          console.log(err);
        })
      }

      console.log(result.needsToDelete);
    });
  }
}

// Posting Delete Modal
@Component({
  selector: 'account-delete-confirmation',
  templateUrl: 'account-delete-confirmation.html',
  styleUrls: ["./account-page.component.scss"]
})

export class AccountDeleteConfirmationDialog {
  constructor(public dialogRef: MatDialogRef<AccountDeleteConfirmationDialog>) { }

  cancelDeletion() {
    this.dialogRef.close({
      needsToDelete: false
    });
  }

  deletePosting() {
    this.dialogRef.close({
      needsToDelete: true
    });
  }
}

@Component({
  selector: 'view-market-posts',
  templateUrl: 'user-market-posts.html',
  styleUrls: ["./account-page.component.scss"]
})

export class ViewMarketPostsDialog {
  dataReceived: Boolean = false;
  textbooks: any;
  textbookFields: Array<any> = ["textbookName", "facultyName", "courseNumber", "price", "postDate"];
  textbooksFilterableArray: any;

  constructor(public dialogRef: MatDialogRef<ViewMarketPostsDialog>, public dialog: MatDialog, private textbooksService: TextbooksService) { 
    this.textbooksService.getUsersTextbooks(localStorage.getItem('user')).then(results => {
      this.textbooks = JSON.parse(JSON.stringify(results));
      this.textbooks.forEach(textbook => {
        textbook.post_date = textbook.post_date.split('T')[0];
      });

      this.textbooksFilterableArray = JSON.parse(JSON.stringify(this.textbooks));

      this.dataReceived = true;
    }).catch(err => {
      console.log(err);
    })
  }

  closeDialog() {
    this.dialogRef.close({
      needsToDelete: false
    });
  }

  textbookFilter(event: any) {
    let searchValue = event.target.value;
    this.textbooks = this.textbooksFilterableArray.filter(textbook => {
      return (textbook.txt_book_name.toLowerCase().includes(searchValue.toLowerCase()) ||
              textbook.faculty_name.includes(searchValue.toLowerCase()) ||
              textbook.course_name.includes(searchValue));
    });
  }

  getTextbook(textbook: any) {
    const dialogRef = this.dialog.open(MainMarketBookInfoDialog, {
      width: '50%',
      height: '400px',
      data: {
        textbook: textbook
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log("textbook deleted: " + result.textbookDeleted);
      this.textbooksService.getUsersTextbooks(localStorage.getItem('user')).then(results => {
        this.textbooks = JSON.parse(JSON.stringify(results));
        this.textbooks.forEach(textbook => {
          textbook.post_date = textbook.post_date.split('T')[0];
        });
  
        this.textbooksFilterableArray = JSON.parse(JSON.stringify(this.textbooks));
        this.dataReceived = true;
      }).catch(err => {
        console.log(err);
      })
    });
  }
}
