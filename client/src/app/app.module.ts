import { NgModule ,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialExampleModule } from '../material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InboxContentComponent } from './components/inbox-content/inbox-content.component';
import { FormioModule } from 'angular-formio';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { InboxHomeComponent } from './components/inbox-home/inbox-home.component';
import { ComposeSideComponent } from './components/compose-side/compose-side.component';
import { PanelComposeComponent } from './components/panel-compose/panel-compose.component';
import { InboxDetailsComponent } from './components/inbox-details/inbox-details.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { ConfirmnDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ReplyComponent } from './components/reply/reply.component';
import { FormRenderingComponent } from './form-rendering/form-rendering.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
@NgModule({
	declarations: [
		AppComponent,
		InboxContentComponent,
		NavBarComponent,
		SideBarComponent,
		InboxHomeComponent,
		ComposeSideComponent,
		PanelComposeComponent,
		InboxDetailsComponent,
		DateAgoPipe,
		ConfirmnDialogComponent,
		ReplyComponent,
  FormRenderingComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		MaterialExampleModule,
		MatSelectModule,
		MatNativeDateModule,
		HttpClientModule,
		FormioModule,
		TranslateModule.forRoot({
			loader:{
				provide:TranslateLoader,
				useFactory:HttpLoaderFactory,
				deps:[HttpClient]
			},
			defaultLanguage:'en'
		})
	],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
		NO_ERRORS_SCHEMA
	]
})
export class AppModule { }
