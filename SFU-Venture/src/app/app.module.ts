import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JwtModule } from '@auth0/angular-jwt'; 
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NavBarComponent } from './pages/nav-bar/nav-bar.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './services/auth-guard/auth.guard';
import { LoginGuard } from './services/login-guard/login.guard'; 
import { LogoutComponent } from './pages/logout/logout.component';
import { MainMarketDisplayComponent, MainMarketBookInfoDialog, PostingDeleteConfirmationDialog, ContactSellerDialog } from './pages/main-market-display/main-market-display.component';
import { VerifyEmailPageComponent } from './pages/verify-page/verify-email-page/verify-email-page.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ChangeForgottenPasswordComponent } from './pages/change-forgotten-password/change-forgotten-password.component';
import { AddPostComponent } from './pages/add-post/add-post.component';
import { ActivityFinderDisplayComponent, ActivityModalDialog } from './pages/activity-finder-display/activity-finder-display.component';
import { AddActivityComponent } from './pages/add-activity/add-activity.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AccountPageComponent, AccountDeleteConfirmationDialog, ViewMarketPostsDialog } from './pages/account-page/account-page.component';
import { MatListModule } from '@angular/material/list';
import { ChangeAccountPasswordPageComponent } from './pages/change-account-password-page/change-account-password-page.component';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatRippleModule } from '@angular/material/core';
import { AdminPageComponent, ProcessPrivilegesDialog } from './pages/admin-page/admin-page.component';
import { AdminGuard } from './services/admin-guard/admin.guard';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavBarComponent,
    LoginPageComponent,
    LogoutComponent,
    MainMarketDisplayComponent,
    VerifyEmailPageComponent,
    ForgotPasswordComponent,
    ChangeForgottenPasswordComponent,
    AddPostComponent,
    ActivityFinderDisplayComponent,
    AddActivityComponent,
    MainMarketBookInfoDialog,
    PostingDeleteConfirmationDialog,
    ContactSellerDialog,
    AccountPageComponent,
    AccountDeleteConfirmationDialog,
    ChangeAccountPasswordPageComponent,
    ViewMarketPostsDialog,
    AdminPageComponent,
    ProcessPrivilegesDialog,
    ActivityModalDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatRippleModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200'],
        blacklistedRoutes: ['localhost:4200/login']
      }
    })
  ],
  providers: [
    AuthService,
    AuthGuard,
    LoginGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AccountPageComponent,
    MainMarketBookInfoDialog, 
    PostingDeleteConfirmationDialog, 
    ContactSellerDialog,
    AccountDeleteConfirmationDialog,
    ViewMarketPostsDialog,
    ProcessPrivilegesDialog,
    ActivityModalDialog
  ]
})
export class AppModule { }
