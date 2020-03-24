import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/server-apis/users/users.service';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

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
