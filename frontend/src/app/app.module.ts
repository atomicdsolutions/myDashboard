import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddShowComponent } from './components/add-show/add-show.component';
import { ShowDetailsComponent } from './components/show-details/show-details.component';
import { ShowListComponent } from './components/show-list/show-list.component';
import { PublisherListComponent } from './components/publisher-list/publisher-list.component';
import { ImportShowsComponent } from './components/import-shows/import-shows.component';
import { PublisherDetailsComponent } from './components/publisher-details/publisher-details.component';
import { AddPublisherComponent } from './components/add-publisher/add-publisher.component';
import { SimplecastComponent } from './components/simplecast/simplecast.component';
import { PodscribeComponent } from './components/podscribe/podscribe.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './main/nav/nav.component';
import { ScDashComponent } from './tools/sc-dash/sc-dash.component';
import { AudiomaxDashComponent } from './tools/audiomax-dash/audiomax-dash.component';
import { AudioserveDashComponent } from './tools/audioserve-dash/audioserve-dash.component';
import { AudiomaticDashComponent } from './tools/audiomatic-dash/audiomatic-dash.component';
import { VastComponent } from './tools/vast/vast.component';
import { PodscribeDashComponent } from './tools/podscribe-dash/podscribe-dash.component';
import { MetadataComponent } from './tools/metadata/metadata.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MaterialModule } from './modules/material module';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    AppComponent,
    AddShowComponent,
    ShowDetailsComponent,
    ShowListComponent,
    PublisherListComponent,
    ImportShowsComponent,
    PublisherDetailsComponent,
    AddPublisherComponent,
    SimplecastComponent,
    PodscribeComponent,
    NavComponent,
    PodscribeDashComponent,
    ScDashComponent,
    AudiomaxDashComponent,
    AudioserveDashComponent,
    AudiomaticDashComponent,
    VastComponent,
    MetadataComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
