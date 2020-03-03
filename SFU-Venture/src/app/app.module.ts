import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
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
import { VerifyEmailPageComponent } from './pages/verify-page/verify-email-page/verify-email-page.component';

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
    VerifyEmailPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
    LoginGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
