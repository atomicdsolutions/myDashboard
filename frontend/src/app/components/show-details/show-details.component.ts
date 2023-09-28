import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Show } from 'src/app/models/show.model';
import { ShowsService } from 'src/app/service/shows.service';

@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.scss']
})
export class ShowDetailsComponent implements OnInit {
  @Input() viewMode = false;
  @Input() currentShow: Show = {
    name: '',
    showCount: 0,
    published: ''
  };


  message = '';
  constructor(
    private showService: ShowsService,
    private route: ActivatedRoute,
    private router: Router) { }
  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getShow(this.route.snapshot.params["id"]);
    }
  }
  getShow(id: string): void {
    this.showService.getShow(id)
      .subscribe({
        next: (data) => {
          this.currentShow = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }
  updatePublished(status: String): void {
    const data = {
      name: this.currentShow.name,
      showCount: this.currentShow.showCount,
      published: this.currentShow.published
    };
    this.message = '';
    this.showService.updateShow(this.currentShow.id, data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.currentShow.published = status;
          this.message = res.message ? res.message : 'The status was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }
  updateShow(): void {
    this.message = '';
    this.showService.updateShow(this.currentShow.id, this.currentShow)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message ? res.message : 'This show was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }
  deleteShow(): void {
    this.showService.deleteShow(this.currentShow.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/shows']);
        },
        error: (e) => console.error(e)
      });
  }

}
