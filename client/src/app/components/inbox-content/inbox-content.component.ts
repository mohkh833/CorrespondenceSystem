import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
	MatSnackBar,
	MatSnackBarHorizontalPosition,
	MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

type Request = {
	correspondence_no?: string | null | undefined;
	correspondence_type?: string | null | undefined;
	entry_no?: string | null | undefined;
	to_entity?: string | null | undefined;
	to_department?: string | null | undefined;
	priority?: string | null | undefined;
	classification?: string | null | undefined;
	await_reply?: Boolean | null | undefined;
	correspondence_body?: string | null | undefined;
	correspondence_subject?: string | null | undefined;
	sent_date?: string | null | undefined;
	cc_entity?: [string] | null | undefined;
	due_date?: string | null | undefined;
};

@Component({
	selector: 'inbox-content',
	templateUrl: './inbox-content.component.html',
	styleUrls: [ './inbox-content.component.css' ]
})
export class InboxContentComponent implements OnInit {
	messageForm = this.fb.group({
		correspondence_no: [ '', Validators.required ],
		correspondence_type: [ '' ],
		entry_no: [ '' ],
		to_entity: [ '' ],
		to_department: [ '' ],
		classification: [ '' ],
		correspondence_subject: [ '' ],
		correspondence_body: [ '' ],
		priority: [ '' ],
		await_reply: [ false ],
		due_date: [ '' ],
		// attached_docs_ids: this.fb.array([]),
		// carbonCopy:[''],
		cc_entity: [ '' ],
		// submit: ['']
	});
	path = this.route.url;
	draftedData:any = {}
	currentDate: string;
	returnedData: any = {};
	isSent: Boolean = false;
	submissionValue:any;
	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'bottom';
	formSrc:any;
	cors_body: string | null | undefined = '';
	isShown: boolean = false;
	browserLang: any ;
	constructor(	
		private fb: FormBuilder,
		private messageService: MessageService,
		private route: Router,
		private activeRoute: ActivatedRoute,
		private _snackBar: MatSnackBar,
		public translate:TranslateService
	) {
		this.currentDate = new Date().toISOString().slice(0, 10);
		translate.onLangChange.subscribe(lang=>{
            this.browserLang = lang;
        })
	}

	getFormData(){
		this.messageService.getFormData().subscribe((res)=>{
			res.components.map((item:any)=>{
				let labelKey = "FORMIO." + item.label 
				item.label = this.translate.instant(labelKey)
			})
			this.formSrc = res
		})
	}

	change($event: any) {
		this.cors_body = $event.target.textContent;
	}

	showCC() {
		this.isShown = !this.isShown;
	}

	handleCC(value: any) {
		if(value[0] != ""){
			value = value.split(',');
			return value;
		}
	}

	getMessagesCount() {
		this.messageService.getMessageCount();
	}

	getDataFromFormIO(e:any) {
		let messageId = this.activeRoute.snapshot.paramMap.get('id');
		delete e.data.submit;  
		if (messageId == null)
			this.messageForm.setValue(e.data)
		this.submitData()
	}

	handleDataSentToServer = () => {
		let cc_entity: [string] = this.handleCC(this.messageForm.value.cc_entity);
		this.returnedData = {
			...this.messageForm.value,
			cc_entity: cc_entity
		};
	}

	submitData() {
		let messageId = this.activeRoute.snapshot.paramMap.get('id');
		this.handleDataSentToServer()
		if (messageId == null) {
			this.sendMessage()
		} else {
			this.unDraftMessage(messageId)
		}
		this.isSent = true;
		// this.route.navigate(['/home']);
		
	}
	

	sendMessage(){
		this.messageService.sendMessage(this.returnedData).subscribe(() => {
			this.getMessagesCount();
			this.openSnackBar('Message Sent','redNoMatch')
		},
		(err) => {
			this.handleSubmitErrors(err)
		});
	}

	unDraftMessage(messageId:string){
		this.messageService.sendDraftMessage(messageId, this.draftedData, false).subscribe(() => {
			this.getMessagesCount();
			this.openSnackBar('Message Sent','redNoMatch')
		},
		(err)=>{
			this.handleSubmitErrors(err)
		});
	}

	handleSubmitErrors = (err:any) => {
		let errorCode:string =   err.error.errorCodes[0]
		let errorValue = "ERROR CODES." + errorCode
		let errorMessage = this.translate.instant(errorValue)
		this.openSnackBar(errorMessage,'Error')
	}

	getDraftedMessage() {
		let messageId = this.activeRoute.snapshot.paramMap.get('id');
		this.messageService.getDraftedMessage(messageId).subscribe((result) => {
			this.returnedData = result.data;
			this.returnedData.cc_entity = this.returnedData.cc_entity.toString() 
			this.submissionValue = {
				"data" :this.returnedData
			}
		},
		(err) => {
			this.handleSubmitErrors(err)
		});
	}

	checkFieldValues() {
		const formValue = this.draftedData;
		const mapped = Object.values(formValue).map((value) => !!value);
		const hasValues = mapped.some((value) => value);
		return hasValues;
	}

	handleDraftMessages(){
		let messageId = this.activeRoute.snapshot.paramMap.get('id');
		let hasValues = this.checkFieldValues()
		if(hasValues){
			if (messageId === null) {
				this.draftMessage()
			} else if (!this.isSent) {
				this.editDraft(messageId)
			}
		}
	}

	draftMessage(){
		this.messageService.draftMessages(this.draftedData).subscribe((returnedData) => {
			this.getMessagesCount();
			this.openSnackBar('Message Drafted','redNoMatch')
		})
	}

	editDraft(messageId: string){
		this.messageService.sendDraftMessage(messageId, this.draftedData, true).subscribe((result) => {
			this.getMessagesCount();
			this.openSnackBar('Draft edited','redNoMatch')
		});
	}

	detectLanguageChange() {
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            // this.browserLang = event.lang
			this.getFormData()
        });
	}

	getDataDraftedMessage (e:any){
		if(e.data != undefined)
			this.draftedData = e.data
	}

	openSnackBar(message:string, color:string) {
		this._snackBar.open(message, '', {
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
			duration: 1500,
			panelClass:[color]
		});
	}

	@HostListener('window:beforeunload')
	onBeforeUnload() {
		if(this.isSent==true)
		return 
		this.handleDraftMessages()
	}

	ngOnDestroy() {
		if(this.isSent==true)
		return 
		this.handleDraftMessages()
	}

	ngOnInit(): void {
		if (this.path.startsWith('/draft')) {
			this.getDraftedMessage();
		}
		this.getFormData()
		this.detectLanguageChange()
	}
}
