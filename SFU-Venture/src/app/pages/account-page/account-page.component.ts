import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/server-apis/users/users.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainMarketBookInfoDialog } from '../main-market-display/main-market-display.component';
import { TextbooksService } from '../../services/server-apis/textbooks/textbooks.service';
import { ProcessPrivilegesDialog } from '../admin-page/admin-page.component';

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {
  user: any;
  accessLevel: any;
  userRetrieved: Boolean = false;

  normalUser: Boolean = false;
  adminViewingUser: Boolean = false;
  adminViewingFromModal: Boolean = false;
  userIsDefaultAdmin: Boolean = false;

  forceCloseModal: Event;

  constructor(
    private usersService: UsersService, 
    private router: Router, 
    public dialog: MatDialog
  ) {
    this.pullUserAccount();    
  }

  pullUserAccount() {
    let userToPull = this.router.url == "/admin-control" ? localStorage.getItem('admin-viewed-user') : localStorage.getItem('user');
    this.usersService.getById(userToPull).then(result => {
      this.user = JSON.parse(JSON.stringify(result[0]));

      if (this.user.is_admin) {
        this.accessLevel = "Administrator";

        if (this.user.email == "sfuventure470@gmail.com") {
          this.userIsDefaultAdmin = true;
          this.accessLevel = "Default Administrator";
        }

      } else if (this.user.is_faculty) {
        if (this.user.is_faculty_verified) {
          this.accessLevel = "Faculty";
        } else {
          this.accessLevel = "Pending Faculty Approval";
        }

      } else {
        this.accessLevel = "Student";
      }

      if (this.user.is_admin && !localStorage.getItem('admin-viewed-user')) {
        this.normalUser = false;
        this.adminViewingUser = false;

      } else if (localStorage.getItem('admin-viewed-user')) {
        this.normalUser = false;

        if (this.user.id == localStorage.getItem('user')) {
          if (this.router.url == "/admin-control") {
            this.adminViewingFromModal = true;
          } else {
            this.adminViewingFromModal = false;
          }
          
          this.adminViewingUser = false;
        } else {
          this.adminViewingUser = true;
        }

      } else {
        this.normalUser = true;
        this.adminViewingUser = false;
      }

      this.userRetrieved = true;
    }).catch(err => {
      console.log(err);
    });
  }

  ngOnInit() {
    this.forceCloseModal = new CustomEvent('close-user-modal');
  }

  editAccountDetails() {
    this.router.navigate(['edit-account-details']);
  }

  changePassword() {
    this.router.navigate(['change-account-password']);
  }

  changePrivileges() {
    localStorage.setItem('admin-processing-user', JSON.stringify(this.user));
    const dialogRef = this.dialog.open(ProcessPrivilegesDialog, {
      width: '40%',
      height: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      localStorage.removeItem('admin-processing-user');

      if (result && result.status == "handled") {
        this.pullUserAccount();
      }
    });
    
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
      if (result && result.needsToDelete) {
        
        let userToDelete = this.router.url == "/admin-control" ? localStorage.getItem('admin-viewed-user') : localStorage.getItem('user');
        this.usersService.delete(userToDelete).then(result => {
          if (this.router.url == "/admin-control") {
            document.dispatchEvent(this.forceCloseModal);
          } else {
            this.router.navigate(['logout']);
          }
        }).catch(err => {
          console.log(err);
        })
      }
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
    });
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
