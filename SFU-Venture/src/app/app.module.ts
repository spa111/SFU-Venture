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
import { MainMarketDisplayComponent } from './pages/main-market-display/main-market-display.component';
import { VerifyEmailPageComponent } from './pages/verify-page/verify-email-page/verify-email-page.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ChangeForgottenPasswordComponent } from './pages/change-forgotten-password/change-forgotten-password.component';
import { AddPostComponent } from './pages/add-post/add-post.component';

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
    AddPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
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
