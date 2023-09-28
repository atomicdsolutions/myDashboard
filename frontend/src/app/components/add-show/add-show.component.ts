import { Component, OnInit } from '@angular/core';
import { Subscriber } from 'rxjs';
import { Show } from 'src/app/models/show.model';
import { ShowsService } from 'src/app/service/shows.service';

@Component({
  selector: 'app-add-show',
  templateUrl: './add-show.component.html',
  styleUrls: ['./add-show.component.scss']
})
export class AddShowComponent implements OnInit {
  show: Show = {
    name: '',
    showCount: 0,
    awCollectionId: '',
    publisherId: '',
    published: '',
    rssFeed: ''
  };
  submitted = false
  constructor(private showService: ShowsService) { }

  ngOnInit(): void {
  }
  saveShow(): void {
    const data = {
      name: this.show.name,
      showCount: this.show.showCount,
      published: this.show.published,
      awCollectionId: this.show.awCollectionId,
      publisherId: this.show.publisherId,
      rssFeed: this.show.rssFeed
    };
    this.showService.createShow(data)
      .subscribe({
        next: (res) => {
          this.submitted = true;
        },
        error: (e) => console.log(e)
      });
  }
  newShow(): void {
    this.submitted = false;
    this.show = {
      name: '',
      showCount: 0,
      awCollectionId: '',
      published: '',
      publisherId: '',
      rssFeed: ''
    };
  }
}
