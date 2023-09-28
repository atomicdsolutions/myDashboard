import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Show } from 'src/app/models/show.model';
import { ShowsService } from 'src/app/service/shows.service';
/**
 * Supported comment
 */
@Component({
  selector: 'app-show-list',
  templateUrl: './show-list.component.html',
  styleUrls: ['./show-list.component.scss']
})
export class ShowListComponent implements OnInit {
  Shows?: Show[];
  currentShow: Show = {};
  currnetIndex = -1;
  name = '';

  displayedColumns: string[] = ['image_url', 'name', 'showCount', 'awCollectionId', 'publisherId'];
  dataSource = new MatTableDataSource<Show>([]);

  constructor(private showService: ShowsService) { }

  ngOnInit(): void {
    this.retrieveShows();
    // console.log(this.dataSource);
  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  retrieveShows(): void {
    this.showService.getAllShows()
      .subscribe({
        next: (data: Show[]) => {
          this.Shows = data;
          this.dataSource.data = data;
        },
        error: (e) => console.error(e)
      });
  }
  refreshList(): void {
    this.retrieveShows();
    this.currentShow = {};
    this.currnetIndex = -1;
  }
  setActiveShow(show: any, index: number): void {
    this.currentShow = show;
    this.currnetIndex = index;
  }
  removeAllShows(): void {
    this.showService.deleteAllShows()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => console.error(e)
      });
  }
  searchName(): void {
    this.currentShow = {};
    this.currnetIndex = -1;
    this.showService.findByNameShow(this.name)
      .subscribe({
        next: (data) => {
          this.Shows = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  
}
