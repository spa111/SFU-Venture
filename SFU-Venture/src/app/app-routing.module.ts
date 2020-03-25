import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from '../app/pages/home-page/home-page.component';
import { LoginPageComponent } from '../app/pages/login-page/login-page.component';
import { AuthGuard } from '../app/services/auth-guard/auth.guard';
import { LogoutComponent } from '../app/pages/logout/logout.component';
import { MainMarketDisplayComponent } from './pages/main-market-display/main-market-display.component';
import { VerifyEmailPageComponent } from '../app/pages/verify-page/verify-email-page/verify-email-page.component';
import { LoginGuard } from '../app/services/login-guard/login.guard';
import { ForgotPasswordComponent } from '../app/pages/forgot-password/forgot-password.component';
import { ChangeForgottenPasswordComponent } from '../app/pages/change-forgotten-password/change-forgotten-password.component';
import { AddPostComponent } from './pages/add-post/add-post.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { ChangeAccountPasswordPageComponent } from './pages/change-account-password-page/change-account-password-page.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminGuard } from './services/admin-guard/admin.guard';

// Each route to an object is encased in a separate object
// path - The URL path to the HTML component
// pathMatch - Entire path name must be typed in to match a route specified
// component - HTML component to load
const routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      component: HomePageComponent
    },
    {
      path: 'login',
      pathMatch: 'full',
      component: LoginPageComponent,
      canActivate: [LoginGuard]
    },
    {
      path: 'logout',
      pathMatch: 'full',
      component: LogoutComponent
    },
    {
      path: 'market',
      pathMatch: 'full',
      component: MainMarketDisplayComponent,
      canActivate: [AuthGuard]

    },
    {
      path: 'add-post',
      pathMatch: 'full',
      component: AddPostComponent,
      canActivate: [AuthGuard]

    },{
      path: 'verify-email/:token',
      pathMatch: 'full',
      component: VerifyEmailPageComponent
    },
    {
      path: 'forgot-password',
      pathMatch: 'full',
      component: ForgotPasswordComponent
    },
    {
      path: 'change-forgotten-password/:token',
      pathMatch: 'full',
      component: ChangeForgottenPasswordComponent
    },
    {
      path: 'account',
      pathMatch: 'full',
      component: AccountPageComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'change-account-password',
      pathMatch: 'full',
      component: ChangeAccountPasswordPageComponent,
      canActivate: [AuthGuard]
    },
    {
      path: 'admin-control',
      pathMatch: 'full',
      component: AdminPageComponent,
      canActivate: [AdminGuard]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
