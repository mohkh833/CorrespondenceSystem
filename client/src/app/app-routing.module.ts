import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxContentComponent } from './components/inbox-content/inbox-content.component';
import { InboxDetailsComponent } from './components/inbox-details/inbox-details.component';
import { InboxHomeComponent } from './components/inbox-home/inbox-home.component';
import { ReplyComponent } from './components/reply/reply.component';

const routes: Routes = [
	{ path: 'send', component: InboxContentComponent, title: 'Send' },
	{ path: 'threadId/:threadId/reply/:replyId', component: ReplyComponent, title: 'Reply' },
	// { path: 'reply/:id/replyId/:replyId', component: ReplyComponent, title: 'Reply' },
	{ path: 'draft/threadId/:id/replyId/:replyId/last-reply/:last-reply', component: ReplyComponent, title: 'Drafted Reply' },
	{ path: 'home', component: InboxHomeComponent, title: 'Home' },
	{path:'', redirectTo:'home', pathMatch:'full'},
	{path:'home/:id', component:InboxDetailsComponent},
	{path: 'sent', component: InboxHomeComponent, title: 'Sent'},
	{path:'sent/:id', component:InboxDetailsComponent},
	{path: 'starred', component: InboxHomeComponent, title: 'Starred'},
	{path:'starred/:id', component:InboxDetailsComponent},
	{path: 'trash', component: InboxHomeComponent, title: 'Trash'},
	{path:'trash/:id', component:InboxDetailsComponent},
	{path: 'draft', component: InboxHomeComponent, title: 'Draft'},
	{path:'draft/:id', component:InboxContentComponent, title: 'Drafted Message'},
	{path:'draft-reply/:id', component:ReplyComponent,  title: 'Drafted Reply'},
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
