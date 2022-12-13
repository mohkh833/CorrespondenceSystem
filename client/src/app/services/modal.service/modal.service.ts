import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from '../message.service/message.service';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private displayStyleSource = new BehaviorSubject<string>('');
  private messageId = new BehaviorSubject<string>('')
  status = this.displayStyleSource.asObservable()
  id = this.messageId.asObservable()
  constructor( private messageService: MessageService) { }

  togglePopUp(status:string){
    this.displayStyleSource.next(status);
  }

  getmessageId(id: any){
    this.messageId.next(id)
  }
  
  deleteMessage(id: any){
    this.messageService.deleteMessages([id]).subscribe((data)=>{
      this.messageService.getMessageCount()
    })
  }

}
