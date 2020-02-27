import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from '../app/pages/home-page/home-page.component';
import { LoginPageComponent } from '../app/pages/login-page/login-page.component';
import { AuthGuard } from '../app/services/auth-guard/auth.guard';
import { LogoutComponent } from '../app/pages/logout/logout.component';

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
      component: LoginPageComponent
    },
    {
      path: 'logout',
      pathMatch: 'full',
      component: LogoutComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
