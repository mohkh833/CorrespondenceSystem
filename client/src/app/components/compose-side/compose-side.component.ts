import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router  } from '@angular/router';
import { MessageService } from 'src/app/services/message.service/message.service';
import { HttpClient } from '@angular/common/http';
import {Location} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { filter } from 'rxjs';

@Component({
	selector: 'compose-side',
	templateUrl: './compose-side.component.html',
	styleUrls: [ './compose-side.component.css' ]
})
export class ComposeSideComponent implements OnInit{
	constructor(private router:Router, private http: HttpClient, public messageService: MessageService, private location: Location, public translate: TranslateService) {}

	isShown: boolean = false;
	inboxActive: boolean= false;
	sentActive: boolean= false;
	starredActive: boolean= false;
	trashActive: boolean= false;
	draftActive: boolean= false;
	path = this.router.url
	


	// getMessagesCount() {
	// 	this.messageService.getMessageCount().subscribe((data)=>{
	// 		this.unreadCount = data.unreadCount
	// 		this.starredCount = data.starredCount
	// 	})
	// }
	onClick(){
		// console.log(this.location)
		// this.handlePaths()
		// console.log(this.route.url);
	}

	handlePaths(){
		// var currentLocation = window.location;
		// console.log(currentLocation)
		this.draftActive= false
		this.inboxActive = false
		this.sentActive = false
		this.starredActive = false
		this.trashActive = false

		if(this.router.url.startsWith('/home')){
			this.inboxActive = true

		}

		if(this.router.url.startsWith('/sent'))
			this.sentActive = true
			
		if(this.router.url.startsWith('/starred'))
			this.starredActive = true

		if(this.router.url.startsWith('/trash'))
			this.trashActive= true
			
		if(this.router.url.startsWith('/draft'))
			this.draftActive= true
	}

	ngOnInit(): void {
		
		this.messageService.getMessageCount()

		this.router.events.subscribe(value => {
			if(value instanceof NavigationEnd)    
				this.path = this.router.url.toString();
			this.handlePaths()
		});
	}

}
