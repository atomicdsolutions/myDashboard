import { Component, OnInit, ViewChild  } from '@angular/core';
import { PublisherService } from 'src/app/service/publisher.service';
import { ShowsService } from 'src/app/service/shows.service';
import { Publisher } from 'src/app/models/publisher.model';
import { Show } from 'src/app/models/show.model';
import { SimplecastService } from 'src/app/service/simplecast.service'; ''
import { animate, state, style, transition, trigger } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiGatewayService } from 'src/app/service/api-gatewa.service';
import { MatDialog } from '@angular/material/dialog';
import { DashboardComponent } from '../dashboard/dashboard.component';

const scUrl = environment.SC_API_URL;

@Component({
  selector: 'app-publisher-list',
  templateUrl: './publisher-list.component.html',
  styleUrls: ['./publisher-list.component.scss']
})


export class PublisherListComponent implements OnInit {
  publishers!: Publisher[];
  currentPublisher: Publisher = {};
  Shows?: Show[];
  Simplecast?: any[];
  currnetIndex = -1;
  name = '';
  newPub?: boolean;
  imported = false;
  dataSource: Publisher[] = [];
  expanded = true;
  feed = "";
  usageData: any;
  usage: any[] = [];
  remain: any[] = [];
  // dataSource = new MatTableDataSource<Publisher>(this.publishers);
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  constructor(
    private publisherService: PublisherService, 
    private showService: ShowsService, 
    private sc: SimplecastService,
    private fb: FormBuilder,
    private ags: ApiGatewayService,
    private dialog: MatDialog
    ) { }

  // displayedColumns: string[] = ['name', 'showCount', 'email', 'website', 'instance', 'type', 'user', 'agency', 'imported'];
  ngOnInit(): void {
    this.retrievePublishers();

  }

  displayedColumns: string[] = ['name', 'showCount', 'instance','get', 'import', 'remainingUsage', 'action', 'previousUsage'];
  // displayedColumns: string[] = ['name', 'showCount', 'email', 'website', 'instance', 'type', 'user', 'agency', 'imported'];

  addPublisher(): void {
    this.newPub = true;
  };
  retrievePublishers(): void {
    this.publisherService.getAllPublishers()
      .subscribe({
        next: (data: Publisher[]) => {
          this.publishers = data;
          this.dataSource = data;
        },
        error: (e) => console.error(e)
      });
  }
  retrieveShows(id: any): void {
    let imported = false;
    this.showService.findbyPublisherId(id)
      .subscribe({
        next: (data: Show[]) => {
          this.Shows = data;
          let count = 0;
          if (Object.entries(data).length > 0) {
            count = Object.entries(data).length
            this.imported = true;
          }
          let newData = { "showCount": count, "imported": this.imported }
          this.updatePublisher(id, newData)
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrievePublishers();
    this.currentPublisher = {};
    this.currnetIndex = -1;
  }
  setActiveShow(publisher: Publisher, index: number): void {
    this.currentPublisher = publisher;
    this.currnetIndex = index;
  }

  searchNamePublisher(): void {
    this.currentPublisher = {};
    this.currnetIndex = -1;
    this.publisherService.findByNamePublisher(this.name)
      .subscribe({
        next: (data) => {
          this.publishers = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }
  updatePublisher(id: any, data: any): void {
    this.publisherService.updatePublisher(id, data)
      .subscribe({
        next: (data) => {
          this.publishers = data;
          // console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  importShows(id: any, user: any): void {
    let uurl = scUrl + "/users/" + user + "/podcasts?sort=created_at_desc&limit=100";
    var objs: any;
    this.sc.getremoteshows(uurl)
      .subscribe({
        next: (data: any) => {
          // console.log(data);
          const objs = data;
          let count = Object.entries(objs).length
          console.log(count);
          for (let index = 0; index < count; index++) {
            delay(30000);
            const obj = objs[index];
            let showNum = 0;
            console.log("Adding Show Number " + showNum + " Named: " + obj.title + " to the database")
            // this.sc.getRssFeed(obj.id)
            //   .subscribe({
            //     next: (feed: any) => {
            this.sc.getRssFeed(obj.id)
            .subscribe({
              next:(showdata =>{
                console.log(showdata);
              })
            })
            const data = {
              name: obj.title,
              published: obj.status,
              showCount: obj.episodes.count,
              awCollectionId: obj.id,
              publisherId: id,
              // rssFeed: feed.feed_url,
              image_url: obj.image_url
            };
            this.showService.createShow(data)
              .subscribe({
                next: (res) => {
                  console.log(res);
                },
                error: (e) => console.log(e)
              });
            //     },
            //     error: (e) => console.log(e)
            //   });
            delay(30000);
            showNum++;
          }
          this.imported = true;
          this.updatePublisher(id, { "showCount": count, "imported": this.imported })

        },
        error: (e: any) => console.error(e)
      });
  }
  deletePublisher(id: any): void {
    this.publisherService.deletePublisher(id)
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (e) => console.log(e)
      });
  }

  getUsageById(publisher: Publisher) {
    console.log(publisher);
    // Call your service or API to get the usage details for the given publisher ID
    this.ags.getUsage(publisher).subscribe((usage: any) => {
      console.log(usage);
      if (!Array.isArray(usage.data)) {
        console.error('Expected usage to be an array, but got:', usage);
        return;
      }
      console.log(usage.data);
      this.usageData = usage.data;

      this.usageData.forEach((item: any[]) => {
        this.usage.push(item[0]);
        this.remain.push(item[1]);
      });

      // console.log(this.usage);
      publisher.currentUsage = this.usage[this.usage.length - 1];
      publisher.remainingUsage = 500000 - this.remain[this.remain.length - 1];

      this.dialog.open(DashboardComponent, {
        width: '800px',
        height: '600px',
        data: { name: publisher.name, chartData: this.usageData }
      });
    });
  }
  getPreviousMonthUsageById(publisher: Publisher) {
    // Call your service or API to get the previous month's usage details for the given publisher ID
    this.ags.getPreviousMonthUsage(publisher).subscribe((usage: any) => {
      if (!Array.isArray(usage.data)) {
        console.error('Expected usage to be an array, but got:', usage);
        return;
      }
      console.log(usage.data);
      const previousMonthUsageData = usage.data;
  
      // Open the dialog to show the data
      this.dialog.open(DashboardComponent, {
        width: '800px',
        height: '600px',
        data: { name: publisher.name, chartData: previousMonthUsageData }
      });
    });
  }

}
