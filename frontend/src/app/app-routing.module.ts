import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PodscribeComponent } from './components/podscribe/podscribe.component';
import { SimplecastComponent } from './components/simplecast/simplecast.component';
import { AddShowComponent } from './components/add-show/add-show.component';
import { PublisherListComponent } from './components/publisher-list/publisher-list.component';
import { ShowDetailsComponent } from './components/show-details/show-details.component';
import { ShowListComponent } from './components/show-list/show-list.component';
import { AudiomaticDashComponent } from './tools/audiomatic-dash/audiomatic-dash.component';
import { AudiomaxDashComponent } from './tools/audiomax-dash/audiomax-dash.component';
import { AudioserveDashComponent } from './tools/audioserve-dash/audioserve-dash.component';
import { PodscribeDashComponent } from './tools/podscribe-dash/podscribe-dash.component';
import { ScDashComponent } from './tools/sc-dash/sc-dash.component';
import { VastComponent } from './tools/vast/vast.component';
import { MetadataComponent } from './tools/metadata/metadata.component';

const routes: Routes = [
  { path: '', redirectTo: 'publishers', pathMatch: 'full' },
  { path: 'shows', component: ShowListComponent },
  { path: 'shows/:id', component: ShowDetailsComponent },
  { path: 'shows/publisher/:id', component: ShowDetailsComponent },
  // { path: 'add', component: AddShowComponent },
  { path: 'publishers', component: PublisherListComponent },
  // { path: 'simplecast/:pub', component: SimplecastComponent },
  // { path: 'podscribe/:pub', component: PodscribeComponent }
  { path: 'scdash', component: ScDashComponent },
  { path: 'amaxdash', component: AudiomaxDashComponent },
  { path: 'aservedash', component: AudioserveDashComponent },
  { path: 'amaticdash', component: AudiomaticDashComponent },
  { path: 'poddash', component: PodscribeDashComponent },
  { path: 'vast', component: VastComponent },
  {path: 'metadata', component: MetadataComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
