# SFU Venture

---
### Angular Quick Start Guide
##### Angular Setup
1. Make sure that you have npm installed and when you do run the following command - `npm install -g @angular/cli`
2. After cloning the project navigate over to the project folder and type in `ng serve`

##### Angular Development
1. Every single html page that gets created is made in its own component.
2. You can generate components by doing `ng generate component new-html-component`
    - Make sure that when you generate the component, you are in the folder you wish to generate it in
    - For HTML component generation, **make sure that you are in the pages directory located in `src/app/pages`**


3. Each component generated contains an HTML file, CSS file, and a TS file which is specific to that component alone.
4. Each component exports a class in the style of `TheComponentName + Component` that is used for routing the webpages


5. For each generated component, to create a route to that html component, go to **`src/app/app-routing-module.ts`** and create the route. Here is an example of the route for the home page component:
    #### app-routing-module.ts
    ```Javascript
    import { NgModule } from '@angular/core';
    import { Routes, RouterModule } from '@angular/router';
    import { HomePageComponent } from '../app/pages/home-page/home-page.component';
    
    // Each route to an object is encased in a separate object
    // path - The URL path to the HTML component
    // pathMatch - Entire path name must be typed in to match a route specified
    // component - HTML component to load
    const routes: Routes = [
        {
            path: '',
            pathMatch: 'full',
            component: HomePageComponent
        }
    ];
    
    @NgModule({
      imports: [RouterModule.forRoot(routes)],
      exports: [RouterModule],
      providers: []
    })
    export class AppRoutingModule { }
    ```

6. To use the routes inside the application for redirecting, use `this.router.navigate(['path name here'])`. Here is an example of using a route in a nav-bar.

    #### nav-bar.component.ts
    ```Javascript
    import { Component, OnInit } from '@angular/core';
    
    // Import the router that allows for manual routing control
    import { Router } from '@angular/router'; 
    
    @Component({
      selector: 'app-nav-bar',
      templateUrl: './nav-bar.component.html',
      styleUrls: ['./nav-bar.component.scss']
    })
    export class NavBarComponent {
    
      // Need to define a variable router that is of type Router
      constructor(private router : Router) { }
    
      // The goToHome function is run when the home button is pressed on the nav-bar
      goToHome() {
        this.router.navigate(['home']);
      }
    }
    ```

7. Angular also allows you to generate services where each service is a set of helper functions and utilities
    - To generate the services, run `ng generate service new-html-service-folder/new-html-service`
    - **Make sure that you run the command from the following folder - `src/app/services` as the command will generate a folder to store the service and the service files themselves within them**

8. To use the services generated, import them from the component and create a variable to use it in the component. Here is an example of the users service being used in the home-page component.
    #### home-page.component.ts
    ```Javascript
    import { Component, OnInit } from '@angular/core';
    import { UsersService } from '../../services/server-apis/users/users.service';
    
    @Component({
      selector: 'app-home-page',
      templateUrl: './home-page.component.html',
      styleUrls: ['./home-page.component.scss']
    })
    export class HomePageComponent implements OnInit {
    
      constructor(private userService : UsersService) { }
    
      ngOnInit() {
        // Console.log the users on the homepage for connection testing
        console.log(this.userService.getAll());
      }
    }
    ```
9. You define variables by doing `variable_name: variable_type = value`. An example is `project_name: string = "SFU Venture"`
---
### Node Server
1. To start the NodeJS server, go into the root of the NodeJS-Server folder and run `node index.js`


