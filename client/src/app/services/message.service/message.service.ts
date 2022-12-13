import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

let url = 'http://localhost:5000';

@Injectable({
	providedIn: 'root'
})

export class MessageService {
	unreadCount: number =0
	starredCount: number=0
	trashedCount: number=0
	draftedCount: number=0
	sentCount:number=0
	
	constructor(private http: HttpClient) {}

	getInboxMessages(page: Number) {
		return this.http.get(`${url}/messages?page=${page}`);
	}
	getMessageById(id: String | null | undefined, title?: string){
		return this.http.get<any>(`${url}/messages/${id}?title=${title}`);
	}
	
	getSentMessages(page: Number) {
		return this.http.get<any>(`${url}/messages/sent?page=${page}`)
	}
	
	getStarredMessages(page: Number) {
		return this.http.get<any>(`${url}/messages/star?page=${page}`)
	}
	
	getMessageCount() {
		this.http.get<any>(`${url}/messages/count`).subscribe((data)=> {
			this.unreadCount= data.unreadCount
			this.starredCount = data.starredCount
			this.trashedCount = data.trashedCount
			this.draftedCount = data.draftedCount
			this.sentCount = data.sentCount
		})
	}
	
	getDeletedMessage(page: Number){
		return this.http.get<any>(`${url}/messages/delete?page=${page}`)
	}

	getDraftedMessages(page:Number){
		return this.http.get<any>(`${url}/messages/draft?page=${page}`)
	}
	
	sendMessage(data: object) {
		return this.http.post<any>(`${url}/messages/`, {data});
	}
	
	fetchPrev(id:any, title: string, lastReply:any, sent_date:any){
		return this.http.get<any>(`${url}/messages/prev/${id}/${lastReply}?title=${title}`)
	}

	fetchNext(id:any, title: string, lastReply: any, sent_date:any){
		return this.http.get<any>(`${url}/messages/next/${id}/${lastReply}?title=${title}`)
	}

	starMessage(id: string | null | undefined, {starred, threadId}:any, location:string) {
		return this.http.put<any>(`${url}/messages/star/${id}?location=${location}`,{starred, threadId});
	}

	readMessage(id:string | null | undefined, threadIds: string[]) {
		return this.http.put<any>(`${url}/messages/status/${id}`,{threadIds});
	}

	deleteMessages(arrOfIds:any){
		return this.http.put<any>(`${url}/messages/delete`, {arrOfIds})
	}

	deleteThreads (threadIds: any){
		return this.http.put<any>(`${url}/messages/deleteThreads`,{threadIds})
	}

	draftMessages(data:object){
		return this.http.post<any>(`${url}/messages/draft`, {data});
	}

	getDraftedMessage(id: string | null | undefined ){
		return this.http.get<any>(`${url}/messages/draft/${id}`)
	}

	sendDraftMessage(id: string | null | undefined, data:any,draft:boolean){
		return this.http.put<any>(`${url}/messages/draft/${id}?draft=${draft}`, {data})
	}

	searchMessages(query:String, page:Number,title:String){
		return this.http.get<any>(`${url}/messages/search?query=${query}&page=${page}&title=${title}`)
	}

	getFormData(){
		return this.http.get<any>(`${url}/form-render`)
	}
}
