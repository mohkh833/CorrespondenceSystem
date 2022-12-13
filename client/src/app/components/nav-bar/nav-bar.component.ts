import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'navbar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  frActive = false;
  enActive = false;
  placeholderText = "NAVBAR.Search for anything"
  constructor(public translate:TranslateService) { }

  ngOnInit(): void {
    this.enActive = true
  }


  changeLanguageToFR(){
    this.frActive = true;
    this.enActive = false;
    this.translate.use('fr')
  }

  changeLanguageToEN(){
    this.frActive = false;
    this.enActive = true;
    this.translate.use('en')
  }
}
