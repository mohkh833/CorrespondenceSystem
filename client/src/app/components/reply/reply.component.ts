import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MessageService } from '../../services/message.service/message.service';
import { ReplyService } from "../../services/reply.service/reply.service"
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
@Component({
	selector: 'app-reply',
	templateUrl: './reply.component.html',
	styleUrls: ['./reply.component.css']
})

export class ReplyComponent implements OnInit {
	messageForm = this.fb.group({
		correspondence_no: ['', Validators.required],
		correspondence_type: [''],
		entry_no: [''],
		to_entity: [''],
		to_department: [''],
		classification: [''],
		correspondence_subject: [''],
		correspondence_body: [''],
		priority: [''],
		await_reply: [false],
		due_date: [''],
		// attached_docs_ids: this.fb.array([]),
		// carbonCopy:[''],
		cc_entity: ['']
	});
	messageId : String | null | undefined= this.getMessageId()
	isDrafted = false
	path = this.router.url;
	currentDate: string;
	returnedData: any = {};
	draftedData: any = {};
	formSrc:any;
	submissionValue:any;
	isSent: Boolean = false;
	horizontalPosition: MatSnackBarHorizontalPosition = 'center';
	verticalPosition: MatSnackBarVerticalPosition = 'bottom';
	cors_body: string | null | undefined = ''; 
	replyId = this.activeRoute.snapshot.paramMap.get('replyId')
	threadId= this.activeRoute.snapshot.paramMap.get('threadId')
	replyTo = this.activeRoute.snapshot.paramMap.get('last-reply')
	isCCShown: boolean = false;
	to_entity: string = ""
	public browserLang: any ;
	constructor(
		private fb: FormBuilder,
		private messageService: MessageService,
		private router: Router,
		private activeRoute: ActivatedRoute,
		private replyService: ReplyService,
		private _snackBar: MatSnackBar,
		public translate:TranslateService
	) {
		this.currentDate = new Date().toISOString().slice(0, 10);
		translate.onLangChange.subscribe(lang=>{
            this.browserLang = lang;
        })
	}

	// getCorsBody($event: any) {
	// 	this.cors_body = $event.target.textContent;
	// }

	showCC() {
		this.isCCShown = !this.isCCShown;
	}

	handleCC(value: any) {
		
		// if(value[0] != ""){
			return value.split(',');
			
		// }
	}

	getMessagesCount() {
		this.messageService.getMessageCount();
	}

	handleSubmitErrors = (err:any) => {
		let errorCode:string =   err.error.errorCodes[0]
		let errorValue = "ERROR CODES." + errorCode
		let errorMessage = this.translate.instant(errorValue)
		this.openSnackBar(errorMessage,'Error')
	}

	openSnackBar(message:string, color:string) {
		this._snackBar.open(message, '', {
			horizontalPosition: this.horizontalPosition,
			verticalPosition: this.verticalPosition,
			duration: 1500,
			panelClass:[color]
		});
	}

	submitReply() {
		if(!this.isDrafted){
			this.replyToMessage()
		} else{
			this.unDraftReply()
		}
		this.isSent = true
	}

	handleDataSentToServer = () => {
		let cc_entity: [string] = this.handleCC(this.messageForm.value.cc_entity);
		this.returnedData = {
			...this.messageForm.value,
			cc_entity: cc_entity
		};
	}

	replyToMessage(){
		this.replyService.replyToMessage(this.returnedData, this.messageId, this.threadId, this.replyId).subscribe(()=>{
			this.getMessagesCount()
			this.openSnackBar('Replied Successfully','redNoMatch')
			// this.router.navigate([`home/${this.threadId}`])
		},(err) => {
			this.handleSubmitErrors(err)
		}
		
		)
	}

	unDraftReply(){
		let threadId = this.activeRoute.snapshot.paramMap.get('id');
		this.replyService.undraftReply(threadId, this.replyId, this.draftedData, this.replyTo).subscribe(()=>{
			this.getMessagesCount()
			this.openSnackBar('Replied Successfully','redNoMatch')
		},(err) => {
			this.handleSubmitErrors(err)
		}
		
		)
	}

	editDraft(){
		this.replyService.editDraft(this.replyId,this.draftedData).subscribe(()=>{
			this.getMessagesCount()
			this.openSnackBar('Drafted Reply edited Successfully','redNoMatch')
		},(err) => {
			this.handleSubmitErrors(err)
		}
		
		)
	}

	getMessageId(){
		return this.activeRoute.snapshot.paramMap.get('replyId');
	}

	getDraftedReply() {
		this.replyService.getDraftedReply(this.messageId,this.replyId).subscribe((result)=>{
			this.returnedData = result;
			this.returnedData.cc_entity = this.returnedData.cc_entity.toString() 
			this.submissionValue = {
				"data" :this.returnedData
			}
		})
	}

	hasValues() {
		const formValue = this.draftedData;
		const mapped = Object.values(formValue).map((value) => !!value);
		const hasValues = mapped.some((value) => value);
		return hasValues;
	}

	getDataDraftedMessage(e:any){
		if(e.data != undefined)
			this.draftedData = e.data
	}

	checkFieldValues() {
		const formValue = this.draftedData;
		const mapped = Object.values(formValue).map((value) => !!value);
		const hasValues = mapped.some((value) => value);
		return hasValues;
	}

	handleDraftReplies(){
		let hasValues = this.checkFieldValues()
		if(hasValues){
			if(this.path.startsWith('/draft')){
				this.editDraft()
				return
			}
			this.draftReply()
		}
	}

	draftReply() {	
		let isReply =false
		if(this.hasValues()){
			this.replyService.draftReply(this.draftedData,this.messageId, isReply, this.threadId).subscribe(()=>{
				this.openSnackBar('Reply Drafted Successfully','redNoMatch')
			},(err) => {
				this.handleSubmitErrors(err)
			})

		}
	}

	loadData() {
		this.replyService.getReply(this.replyId).subscribe((result)=>{
			this.to_entity= result.from_email 
			// this.replyTo = result._id
		})
	}

	loadFormIOData(){
		this.messageService.getFormData().subscribe((res)=>{
			res.components.map((item:any)=>{
				let labelKey = "FORMIO." + item.label 
				item.label = this.translate.instant(labelKey)
			})
			this.formSrc = res
		})
	}

	// handleDataSentToServer = () => {
	// 	let cc_entity: [string] = this.handleCC(this.messageForm.value.cc_entity);
	// 	this.returnedData = {
	// 		...this.messageForm.value,
	// 		cc_entity: cc_entity
	// 	};
	// }

	getDataFromFormIO(e:any){
		let messageId = this.activeRoute.snapshot.paramMap.get('id');
		delete e.data.submit;
		let cc_entity: [string] = this.handleCC(this.messageForm.value.cc_entity);  
		if (messageId == null)
			this.messageForm.setValue(e.data)
		
		this.returnedData = {
			...this.messageForm.value,
			cc_entity
		}
		this.submitReply()
	}

	@HostListener('window:beforeunload')
	onBeforeUnload() {
		if(this.isSent==true)
			return 
		this.handleDraftReplies()
	}

	ngOnDestroy() {
		if(this.isSent==true)
			return 
		this.handleDraftReplies()
	}

	detectLanguageChange() {
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            // this.browserLang = event.lang
			this.loadFormIOData()
        });
	}

	ngOnInit(): void {
		if (this.path.startsWith('/draft')) {
			this.getDraftedReply();
			this.isDrafted = true
		}
		this.loadData()
		this.loadFormIOData()
		this.detectLanguageChange()
	}

}
