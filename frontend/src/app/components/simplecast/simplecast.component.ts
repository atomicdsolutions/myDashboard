import { Component, OnInit } from '@angular/core';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { SimplecastService } from 'src/app/service/simplecast.service';

@Component({
  selector: 'app-simplecast',
  templateUrl: './simplecast.component.html',
  styleUrls: ['./simplecast.component.scss']
})
export class SimplecastComponent implements OnInit {
  Shows?: any[];
  constructor(private sc: SimplecastService) { }

  ngOnInit(): void {
    this.getShows();
  }
  getShows(): void {
    this.sc.getremoteshows("9cba4194-6d3a-42bb-ab05-8e998c4c4f93")
      .subscribe({
        next: (data: any) => {
          this.Shows = data.collection;
          console.log(this.Shows);
        },
        error: (e) => console.log(e)
      })
  };
}
