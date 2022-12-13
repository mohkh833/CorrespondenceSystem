import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

let url = 'http://localhost:5000';

@Injectable({
  providedIn: 'root'
})
export class ReplyService {
  displayState = "none"
  replyData!:any
  messageId!:any
  replied: boolean = false
  constructor(private http: HttpClient) { }

  showWindow(){
    this.displayState="block"
  }
  
  hideWindow(){
    this.displayState="none"
  }

  replyToMessage(data:any, id:String | null | undefined,  threadId:String | null | undefined, replyTo:string | null){
    return this.http.post<any>(`${url}/messages/replies/`, {data,threadId,replyTo})
  }

  getReplies(id:any){
    return this.http.get<any>(`${url}/messages/replies/${id}`)
  }

  getReply(id:any){
    console.log(id)
    return this.http.get<any>(`${url}/messages/replies/${id}`)
  }

  draftReply(data:any, id:String | null | undefined, isReply:boolean, threadId: string | null){
    return this.http.put<any>(`${url}/messages/replies/${id}/draft?isReply=${isReply}`, {data, threadId})
  }

  getDraftedReply(id:any, replyId:any){
    return this.http.get<any>(`${url}/messages/replies/${replyId}/draft`)
  }

  undraftReply(id:any, replyId:any, data: any, replyTo:any){
    console.log(id)
    return this.http.put<any>(`${url}/messages/replies/${id}/${replyId}/undraft`,{data, replyTo})
  }

  editDraft(draftId:string| null, data:any){
    return this.http.put<any>(`${url}/messages/replies/edit-draft/${draftId}`,{data})
  }

}  
