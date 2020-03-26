import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/server-apis/users/users.service';
import { MainMarketBookInfoDialog } from '../main-market-display/main-market-display.component';
import { TextbooksService } from '../../services/server-apis/textbooks/textbooks.service';
import { Router } from '@angular/router';
import { AccountPageComponent, AccountDeleteConfirmationDialog } from '../account-page/account-page.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
  contentLoaded: Boolean = false;

  allUsers: any;
  allUsersFilterableList: any;
  userColumns: Array<any> = ["userId", "username", "fullname", "email", "accessLevel"];

  allFacultyNeedingVerification: any;
  allFaculyFilterableList: any;
  facultyUserColumns: Array<any> = ["userId", "username", "fullname"];

  textbooks: any;
  textbookFields: Array<any> = ["posterId", "textbookName", "facultyName", "courseNumber", "price", "postDate"];
  textbooksFilterableArray: any;

  /* To do an admin override:
    if (this.router.url == "/admin-control") {
      this.adminOverride = true;
    }
  */

  constructor(
    private usersService: UsersService, 
    private textbooksService: TextbooksService,
    public dialog: MatDialog
   ) {

    this.generateAllData();
  }

  ngOnInit() { }

  generateAllData() {

    // Get all the users that the admin can manage
    this.usersService.getAll().then(results => {
      this.allUsers = JSON.parse(JSON.stringify(results));

      // Separate the users where that have a pending approval for faculty status
      this.allFacultyNeedingVerification = this.allUsers.filter(user => {
        
        // Assign access levels at the same time you sort for faculty pending approval
        if (user.is_faculty && !user.is_faculty_verified) {
          user.accessLevel = "Pending Faculty Approval";
          return true;

        } else if (user.is_faculty) {
          user.accessLevel = "Faculty";
          return false;

        } else if (user.is_admin) {
          user.accessLevel = "Administrator";
          return false;

        } 

        user.accessLevel = "Student";
        return false;
      });
      
      this.allUsersFilterableList = JSON.parse(JSON.stringify(this.allUsers));
      this.allFaculyFilterableList = JSON.parse(JSON.stringify(this.allFacultyNeedingVerification));

      // Get all the textbooks that are up on the market
      this.textbooksService.getUsersTextbooks(localStorage.getItem('user')).then(results => {
        this.textbooks = JSON.parse(JSON.stringify(results));
        this.textbooks.forEach(textbook => {
          textbook.post_date = textbook.post_date.split('T')[0];
        });
  
        this.textbooksFilterableArray = JSON.parse(JSON.stringify(this.textbooks));
        this.contentLoaded = true;

      }).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    });
  }

  userFilter(event: any) {
    let searchValue = event.target.value;

    this.allUsers = this.allUsersFilterableList.filter(user => {
      return (user.id == Number(searchValue) ||
              user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
              user.fullname.toLowerCase().includes(searchValue.toLowerCase()) ||
              user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
              user.accessLevel.toLowerCase().includes(searchValue.toLowerCase()));
    });
  }

  facultyFilter(event: any) {
    let searchValue = event.target.value;

    this.allFacultyNeedingVerification = this.allFaculyFilterableList.filter(faculty => {
      return (faculty.id == Number(searchValue) ||
              faculty.username.toLowerCase().includes(searchValue.toLowerCase()) ||
              faculty.fullname.toLowerCase().includes(searchValue.toLowerCase()) ||
              faculty.email.toLowerCase().includes(searchValue.toLowerCase()));
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

      this.textbooksService.getUsersTextbooks(localStorage.getItem('user')).then(results => {
        this.textbooks = JSON.parse(JSON.stringify(results));
        this.textbooks.forEach(textbook => {
          textbook.post_date = textbook.post_date.split('T')[0];
        });
  
        this.textbooksFilterableArray = JSON.parse(JSON.stringify(this.textbooks));
      }).catch(err => {
        console.log(err);
      })
    });
  }

  getUser(user: any) {
    localStorage.setItem('admin-viewed-user', user.id);
    const dialogRef = this.dialog.open(AccountPageComponent, {
      width: '90%',
      height: '90%'
    });

    document.addEventListener('close-user-modal', () => {
      dialogRef && dialogRef.close();
    });

    dialogRef.afterClosed().subscribe(result => {
      localStorage.removeItem('admin-processing-user');
      this.generateAllData();
    });
  }

  processUser(row: any) {
    localStorage.setItem('admin-processing-user', JSON.stringify(row));
    const dialogRef = this.dialog.open(ProcessPrivilegesDialog, {
      width: '40%',
      height: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      localStorage.removeItem('admin-processing-user');
      
      if (result && result.status == "handled") {
        this.generateAllData();
      }
    });
  }
}

// Privileges Processing Modal
@Component({
  selector: 'process-privileges',
  templateUrl: 'process-privileges.html',
  styleUrls: ["./admin-page.component.scss"]
})

export class ProcessPrivilegesDialog {
  user: any;

  constructor(
    public dialogRef: MatDialogRef<ProcessPrivilegesDialog>, 
    public dialog: MatDialog,
    private usersService: UsersService
  ) {
    this.user = JSON.parse(localStorage.getItem('admin-processing-user'));
  }

  convertToAdmin() {
    let payload = {
      "accessLevel": "Admin"
    };
    
    this.updatePrivilegesOnServer(payload);
  }

  convertToFaculty() {
    let payload = {
      "accessLevel": "Faculty"
    };

    this.updatePrivilegesOnServer(payload);
  }

  convertToStudent() {
    let payload = {
      "accessLevel": "Student"
    };

    this.updatePrivilegesOnServer(payload);
  }

  updatePrivilegesOnServer(payload: any) {
    this.usersService.updatePrivileges(this.user.id, payload).then(result => {
      console.log(result);
      this.dialogRef.close({
        "status": "handled"
      });

    }).catch(err => {
      console.log(err);
    });
  }
  
  deleteUser() {
    const deleteDialogRef = this.dialog.open(AccountDeleteConfirmationDialog, {
      width: '30%',
      height: '200px'
    });

    deleteDialogRef.afterClosed().subscribe(result => {
      if (result.needsToDelete) {
        this.usersService.delete(this.user.id).then(results => {

          this.dialogRef.close({
            "status": "handled"
          });

        }).catch(err => {
          console.log(err);
        });
      }
    });

  }
}
