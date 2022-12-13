import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service/message.service';
import {ReplyService} from 'src/app/services/reply.service/reply.service'
import { TranslateService } from '@ngx-translate/core';

type MessageResponse = {
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
	sent_date?: any;
	cc_entity?: [string] | null | undefined;
	due_date?: string | null | undefined;
  Starred?: boolean
  _id?:any,
  message_status?: string | null | undefined,
  replyTo?: string | null | undefined 
};

@Component({
  selector: 'app-inbox-details',
  templateUrl: './inbox-details.component.html',
  styleUrls: ['./inbox-details.component.css']
})

export class InboxDetailsComponent implements OnInit {
  message :MessageResponse = {}
  thread : any= []
  threadDrafts: any = undefined
  messageId = this.route.snapshot.paramMap.get('id');
  pathName = this.router.url.split('/')[1]
  corsSubject = ''
  messagesCount! : number
  showSecondComponent = false;
  messageCount!: number
  nextDisabled: boolean = false;
	prevDisabled: boolean = false;
  lastDraft = ''
  sent_date = ''
  displayStyle: string = "none";
  Date:any
  lastReply = ''
  pageTitle = ''
  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private messageService: MessageService,
    private replyService:ReplyService,
    public translate:TranslateService
  ) {
    translate.addLangs(['en', 'fr']);
   }

  refresh(){
    this.loadMessage()
  }

  fetchPrev(){
    this.messageService.fetchPrev(this.messageId, this.pathName,this.lastReply, this.sent_date).subscribe((data)=> {
      let threadId = data[0]._id
      this.router.navigate([`${this.pathName}/${threadId}`])
      this.messageId = threadId
      this.loadMessage()
      this.getMessagesCount()
    })
  }

  fetchNext(){
    this.messageService.fetchNext(this.messageId,this.pathName,this.lastReply,this.sent_date).subscribe((data)=> {
      let threadId = data[0]._id
      this.router.navigate([`${this.pathName}/${threadId}`])
      this.messageId = threadId
      this.loadMessage()
      this.getMessagesCount()
    })
  }

  deleteMessage() {
    let threadIds:Array<string> = this.getThreadIds()
    console.log(threadIds)
    this.messageService
    .deleteMessages(threadIds).subscribe(()=>{
      this.getMessagesCount()
    })
    this.displayStyle = "none"
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

		if (isToday(time)) {
			let checkDate = time.toLocaleTimeString().split(':')[0];
			let date = time.toLocaleTimeString();
			if (+checkDate < 10) date = time.toLocaleTimeString().slice(0, 4);
			else date = time.toLocaleTimeString().slice(0, 5);
			return date + ' ' + time.toLocaleTimeString().slice(8, 11);
		} else 
			return time.toDateString()
	}

  handleThreadDrafts(res:any){
    if(res.drafts.length != 0)
    this.threadDrafts = res.drafts[0].Correspondence
  else
    this.threadDrafts = undefined
  }

  loadMessage() {
    this.messageService.getMessageById(this.messageId, this.pathName).subscribe((res) => {
      this.thread = res.data[0].Correspondence
      this.corsSubject = this.thread[0].content.correspondence_subject
      this.handleThreadDrafts(res)
      this.getLastElement()
      this.formateDate()
      this.setMessagesCount(res)
      this.handleReadMessage()
      this.handlePagination()
    },
    (err) => console.log(err))
  }

  getLastElement(){
    // we want to get the last not drafted element
    this.lastDraft = this.thread[this.thread.length-1]._id
    this.sent_date = this.thread[this.thread.length-1].content.sent_date
    console.log(this.sent_date)
    if(this.thread.length > 1){
      let i = this.thread.length-1
      let threadsArr = this.thread
      let lastReply = ''
      while(i>=0){
        // console.log(threadsArr[i])
        if(threadsArr[i].content.isDrafted === false){
          lastReply = threadsArr[i]._id
          break;
        }
        
        i--;
      }
      this.lastReply = lastReply
      console.log( this.lastReply)
    }else{
      this.lastReply = this.thread[0]._id
      console.log(this.lastReply)
    }

  }

  formateDate(){
    this.thread.map((item:any)=>{
      item.content.formattedDate = this.handleDate(new Date(item.content.sent_date))
  })
  }


  setMessagesCount(res:any){
    this.messagesCount = res.messagesCount 
    this.messageCount = res.messageCount
  }

  handleReadMessage(){
    if(this.message.message_status != "seen") 
      this.readMessage() 
  }

  handlePagination(){
    if(this.messageCount==this.messagesCount) this.nextDisabled =true
    else this.nextDisabled =false
    
    if(this.messageCount == 1)  this.prevDisabled = true
    else this.prevDisabled = false
  }
  
  getMessagesCount() {
    this.messageService.getMessageCount()
	}

  readMessage(){
    let threadIds:Array<string> = this.getThreadIds()
    this.messageService.readMessage(this.lastReply, threadIds).subscribe(()=>{
      this.getMessagesCount()
    })
  }

  getThreadIds = () => {
    let threadIds:Array<string> = []
    this.thread.map((item:any)=>{
      threadIds.push(item._id)
    })
    return threadIds
  }
  
	starMessage(reply:any) {
    let location = "details"
    this.messageService
    .starMessage(reply._id, {
      starred: !reply.content.Starred
    }, location)
    .subscribe(() => {
      this.message.Starred = !this.message.Starred 
				this.getMessagesCount()
        if(!reply.content.isDrafted)
          this.starSpecificMessage(reply._id)
        else
          this.starDraftedReply(reply._id)
			});
	}

  starSpecificMessage(id:string){
    this.thread.filter((item:any)=>{
      if(item._id==id)
        item.content.Starred = !item.content.Starred 
    })
  }

  starDraftedReply(id:string){
    this.threadDrafts.filter((item:any)=>{
      if(item._id==id)
        item.content.Starred = !item.content.Starred 
    })
  }

  openPopup() {
    this.displayStyle = "block"
  }

  closePopup() {
    this.displayStyle = "none";
  }

  printPage(){
    window.print()
  }

  replyToMessage(){
    this.router.navigate([`threadId/${this.messageId}/reply/${this.lastReply}`])
  }

  getDraftedReply(value:any){
    let replyId = value._id
    this.router.navigate([`draft/threadId/${this.messageId}/replyId/${replyId}/last-reply/${this.lastReply}`])
  }

  handlePageBadge(){
    if (this.pathName== 'starred'){
      this.pageTitle = 'STARRED'
    }
    else if (this.pathName== "trash"){
      this.pageTitle = 'TRASH'
    }
    else if(this.pathName =="sent"){
      this.pageTitle = 'SENT'
    } else{
      this.pageTitle = 'INBOX'
    }
  }

  ngOnInit(): void {
    this.loadMessage()
    this.handlePageBadge()
  }

}
