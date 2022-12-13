import { Component, OnInit,} from '@angular/core';
import { Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MessageService } from '../../services/message.service/message.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ReplyService } from 'src/app/services/reply.service/reply.service';
@Component({
	selector: 'app-inbox-home',
	templateUrl: './inbox-home.component.html',
	styleUrls: ['./inbox-home.component.css']
})
export class InboxHomeComponent implements OnInit {
	constructor(private messageService: MessageService, private route: Router, public translate:TranslateService) { }
	path = this.route.url;
	displayStyle: string = "none";
	pathName = this.route.url.split('/')[1]
	isShown: boolean = false;
	isStarred: boolean = false;
	pageName!: string;
	nextDisabled: boolean = false;
	prevDisabled: boolean = false;
	currentPage: number = 1
	totalPages: number = 0
	current: number = 0
	limit!: number
	searchCount:number =0
	searchFlag: boolean = false
	messages: any = [];
	replies:any = []
	checkBoxIdsArr: any = [];	
	query: string = '';
	queryUpdate = new Subject<string>();
	placeholderText = "HOME.Filter messages"
	notFoundMessageText = ""
// modal operations
	closePopup() {
		this.displayStyle = "none";
	}

	openPopup() {
		if(this.checkBoxIdsArr.length != 0)
		this.displayStyle = "block"
	}
///

	emptySearchBar(){
		this.query=''
		this.queryUpdate.next('')
	}

// navigation operations
	nextPage() {
		if (this.currentPage >= this.totalPages) return;
		++this.currentPage
		if(!this.searchFlag)
			this.handlePaths()
		else
			this.searchMessages(this.currentPage)
	}

	prevPage() {
		if (this.currentPage == 1) return;
		--this.currentPage
		if(!this.searchFlag)
		this.handlePaths()
		else
		this.searchMessages(this.currentPage)
	}

	refresh() {
		this.handlePaths()
	}
///

// check box operations
	checkAll(event: any) {
		const checked = event.target.checked;
		this.checkBoxIdsArr = []
		this.messages.data.forEach((item: any) => {
			item.selected = checked
			if (checked) this.checkBoxIdsArr.push(item.threadId)		
		});
	}

	checkItem = (id:string, threadId:string) => {
		this.messages.data.map((item:any)=>{
			if(item._id == id){
				item.selected =true
			}
		})
		this.checkBoxIdsArr.push(threadId);
	}

	unCheckItem = (id:string, threadId:string) =>{
		var index = this.checkBoxIdsArr.indexOf(threadId);
		if (index > -1) {
			this.checkBoxIdsArr.splice(index, 1);
		}
		this.messages.data.map((item:any)=>{
			if(item._id == id){
				item.selected =false
			}
		})
	}

	handleCheckBox(event: any, id: string) {
		let includeThread = this.checkBoxIdsArr.includes(event.target.value)
		let isThreadChecked = event.target.checked
		let threadId = event.target.value
		if (!includeThread) {
			if (isThreadChecked) {
				this.checkItem(id,threadId)
			}
		} else {
			if (isThreadChecked) {
				this.checkBoxIdsArr.push(threadId);
			} else {
				this.unCheckItem(id, threadId)
			}
		}
	}
///

/// separate data based on paths
	handlePaths() {
			if (this.path.startsWith('/home')  ) {
				this.pageName = 'Inbox';
				this.getInboxMessages(this.currentPage);
			}
	
			if (this.path.startsWith('/sent')) {
				this.pageName = 'Sent';
				this.getSentMessages(this.currentPage);
			}
	
			if (this.path.startsWith('/starred')) {
				this.pageName = 'Starred';
				this.getStarredMessages(this.currentPage);
			}
	
			if (this.path.startsWith('/trash')) {
				this.pageName = 'Trash';
				this.getDeletedMessages(this.currentPage);
			}
	
			if (this.path.startsWith('/draft')) {
				this.pageName = 'Draft';
				this.getDraftedMessages(this.currentPage);
			}
	}
///

// get sent messages 
	getSentMessages(page: number) {
		this.messageService.getSentMessages(page).subscribe(
			(result) => {
				// let res = this.parseData(result)
				this.messages = result;
				this.deleteTags()
				this.handleListFormat()
				this.handlePagination()
			},
			(err) => {
				this.messages.numOfRecords = 0
			}
		);
	}
///

//get all messages
	getInboxMessages(page: number) {
		this.messageService.getInboxMessages(page).subscribe(
			(result) => {
				this.messages = result;
				this.deleteTags()
				this.handleListFormat()
				this.handlePagination()
				this.getMessagesCount()
			},
			(err) => {
				this.messages.numOfRecords = 0
				this.isShown = true
				this.notFoundMessageText = "HOME.There is no Inbox Correspondences"
			}
		);
	}
///


// format messages
	handlePagination() {
		this.totalPages = this.messages.totalPages;
		this.limit = this.messages.limit;
		if (this.currentPage == this.totalPages) this.nextDisabled = true;
		else this.nextDisabled = false;

		if (this.currentPage == 1) this.prevDisabled = true;
		else this.prevDisabled = false;

		this.current = this.currentPage * this.limit - (this.limit-1)
	}

	handleListFormat() {
		this.messages.data.map((value: any) => {
			if(!value.isDrafted)
				value.sent_date = this.handleDate(new Date(value.sent_date));
			else
				value.draftedDate = this.handleDate(new Date(value.draftedDate))
			if(value.correspondence_body !== undefined)
				value.correspondence_body = value.correspondence_body.slice(0, 9);
		});
	}

	deleteTags(){
		this.messages.data.map((item:any) => {
			if(item.correspondence_body != undefined){
				let content = item.correspondence_body
				content = content.replace(/(<([^>]+)>)/ig ,'');
				item.correspondence_body = content
			}	
		})
	}

	handleDate(time: Date) {
		const isToday: any = (someDate: any) => {
			const today = new Date();
			return (
				someDate.getDate() == today.getDate() &&
				someDate.getMonth() == today.getMonth() &&
				someDate.getFullYear() == today.getFullYear()
			);
		};

		const isYear: any = (someDate: any) => {
			const year = new Date();
			return someDate.getFullYear() == year.getFullYear();
		};

		if (isToday(time)) {
			let checkDate = time.toLocaleTimeString().split(':')[0];
			let date = time.toLocaleTimeString();
			if (+checkDate < 10) date = time.toLocaleTimeString().slice(0, 4);
			else date = time.toLocaleTimeString().slice(0, 5);
			return date + ' ' + time.toLocaleTimeString().slice(8, 11);
		} else if (isYear(time))
			// this year
			return time.toUTCString().slice(5, 11);
		else {
			// past years
			let month: any = time.getMonth();
			if (month < 10) month = '0' + month;
			let dateOfMonth: any = time.getDate();
			if (dateOfMonth < 10) dateOfMonth = '0' + dateOfMonth;
			let year = time.getFullYear();
			return dateOfMonth + '/' + month + '/' + year;
		}
	}
///

//draft messages 
	getDraftedMessages(page: number) {
		this.messageService.getDraftedMessages(page).subscribe(
			(result) => {
				this.messages = result
				this.deleteTags()
				this.handleListFormat()
				this.handlePagination()
			},
			(err) => {
				this.messages.numOfRecords = 0
				this.isShown = true
				this.notFoundMessageText = "HOME.There is no Draft Correspondences"
			}
		)
	}
///

//search messages 

	searchMessages(page:number){
		this.messageService.searchMessages(this.query,page,this.pathName).subscribe(
			(data)=>{
			this.messages.data=data.result 
			this.messages.totalPages = data.totalPages
			this.messages.limit = data.limit
			this.messages.numOfRecords = data.numOfRecords
			this.deleteTags()
			this.handleListFormat()
			this.handlePagination()
		},
		(err) => {
			this.messages.numOfRecords = 0
			this.isShown = true
		})
	}

	handleSearch(){
		this.searchCount++;
		this.queryUpdate.pipe(
			debounceTime(400),
			distinctUntilChanged())
			.subscribe(value => {
				if(value != ''){
					if(this.searchCount==1){
						this.currentPage = 1
					}						
					this.searchMessages(this.currentPage)
					this.searchFlag = true
				}
				else {
					this.handlePaths()
					this.searchFlag = false
				}
			});
	}

///

// delete message and deleted messages 

	deleteMessage(checkAllValue:any) {
		this.messageService.deleteThreads(this.checkBoxIdsArr).subscribe((data)=>{
			this.paginateBackIfNoDeletedThreadExist()
			this.handlePaths()
			this.handlePagination()
			this.getMessagesCount()
			this.checkBoxIdsArr = []
		})
		this.displayStyle = "none"
		checkAllValue.checked=false
	}

	paginateBackIfNoDeletedThreadExist(){
		if(this.messages.data.length==this.checkBoxIdsArr.length && this.currentPage != 1){
			this.currentPage--
		}
	}

	getDeletedMessages(page: number) {
		this.messageService.getDeletedMessage(page).subscribe(
			(result) => {
				this.messages = result;
				this.deleteTags()
				this.handleListFormat()
				this.handlePagination();
			},
			(err) => {
				console.log(err)
				this.messages.numOfRecords = 0
				this.isShown = true
				this.notFoundMessageText = "HOME.There is no Trash Correspondences"
			}
		);
	}

	parseData(result:any){
		let res = JSON.parse(JSON.stringify(result))
		res.data= res.data.map((item:any)=>{
			if(item.content.replies.length == 0)
				return {...item.content, _id:item._id }
			else{
				let length = item.content.replies.length
				return {...item.content, replies:item.content.replies[length-1],  _id:item._id }
			}
				
		})
		return res
	}

// star message and starred messages 

	getStarredMessages(page: number) {
		this.messageService.getStarredMessages(page).subscribe(
			(result) => {
				this.messages = result;
				this.deleteTags()
				this.handleListFormat()
				this.handlePagination();
			},
			(err) => {
				this.messages.numOfRecords = 0
				this.isShown = true
				this.notFoundMessageText = "HOME.There is no Starred Correspondences"
			}
		);
	}

	starMessage(id: any, flag: boolean,threadId: string) {
		let location = "inbox"
		this.messageService
			.starMessage(id, {
				starred: !flag,
				threadId:threadId,	
			}, location)
			.subscribe((result) => {
				this.paginateBackIfNoStarredThreadExist()
				this.handlePaths()
				this.handlePagination()
				this.getMessagesCount()
			});
	}

	paginateBackIfNoStarredThreadExist(){
		let starredCount = 0
		this.messages.data.map((item:any)=> {
			if(item.Starred == true)
				starredCount++
		})
		if(starredCount == 1 && this.currentPage != 1){
			this.currentPage--
		}
	}

///

// get messages count
	getMessagesCount() {
		this.messageService.getMessageCount()
	}

///

	ngOnInit(): void {
		this.handlePaths()
		if(!this.totalPages) this.totalPages = 0
		if(!this.limit) this.limit=0
		if(!this.messages.currentPage) this.messages.currentPage=0
		this.handleSearch()
	}
}
