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

// Each route to an object is encased in a separate object
// path - The URL path to the HTML component
// pathMatch - Entire path name must be typed in to match a route specified
// component - HTML component to load
const routes: Routes = [
    {
      path: '',
      pathMatch: 'full',
      component: HomePageComponent,
      canActivate: [AuthGuard]
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
      component: MainMarketDisplayComponent
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
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
