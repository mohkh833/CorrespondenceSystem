import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ReplyService } from "../../services/reply.service/reply.service"
@Component({
	selector: 'panel-compose',
	templateUrl: './panel-compose.component.html',
	styleUrls: [ './panel-compose.component.css' ]
})
export class PanelComposeComponent implements OnInit {
	constructor(public composeService: ReplyService, private fb: FormBuilder,) {}
	displayStyle = this.composeService.displayState
	
	messageForm = this.fb.group({
		replyBody: [ '' ],
		// attached_docs_ids: this.fb.array([]),
		cc_entity: [ '' ],
		reply_to: [''],
	});

	hideWindow() {
		this.composeService.hideWindow()
	}

	ngOnInit(): void {
		this.composeService.replyData = {}
	}

	// replyMessage(){
	// 	this.messageForm.value.reply_to = this.composeService.replyData.from_email
	// 	let data = {...this.messageForm.value}
	// 	this.composeService.replyToMessage(data,this.composeService.messageId, true).subscribe((result)=>{
	// 		console.log(result)
	// 	})
	// }

	change($event:any){
		this.messageForm.value.replyBody = $event.target.textContent;
	}

	ngOnDestroy() {
		this.composeService.hideWindow()
	}
}
