import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-market-display',
  templateUrl: './main-market-display.component.html',
  styleUrls: ['./main-market-display.component.scss']
})



export class MainMarketDisplayComponent implements OnInit {


  ngOnInit() {
  } 

  textbooks : any;

  constructor(){

      this.textbooks = [{
          textbookName : "Operating System Concepts, 9th Edition, Silberschatz, Galvin, Gagne, 2012",
          course : "300",
          faculty : "CMPT",
          price: "10",
          postDate : "August 23",
          imageUrl : "https://picsum.photos/200"
      },
      {
        textbookName : "Operatding System Concepsts, 9th Edition, Silberschatz, Galvin, Gagne, 2012",
          course : "300",
          faculty : "CMPT",
          price: "10",
          postDate : "August 23",
          imageUrl : "https://picsum.photos/200"

      },
      {
        textbookName : "Opedrating System Concepts, 9th Edition, Silberschatz, Galvin, Gagne, 2012",
        course : "300",
        faculty : "CMPT",
        price: "10",
        postDate : "August 23",
        imageUrl : "https://picsum.photos/200"

      },
      {
        textbookName : "Operating System Conceptss, 9th Edition, Silberschatz, Galvin, Gagne, 2012",
        course : "300",
        faculty : "CMPT",
        price: "10",
        postDate : "August 23",
        imageUrl : "https://picsum.photos/200"
      }]
  };

}
