import { Component, OnInit } from '@angular/core';
import { PodscribeService } from 'src/app/service/podscribe.service';

@Component({
  selector: 'app-podscribe',
  templateUrl: './podscribe.component.html',
  styleUrls: ['./podscribe.component.scss']
})
export class PodscribeComponent implements OnInit {
  Pubs?: any;
  newPub?: boolean;
  constructor(private ps: PodscribeService) { }

  ngOnInit(): void {
    this.getPubs();
  }
  
  getPubs(): void {
    this.ps.getShows("b3e289b0-c744-46dd-93f9-512dd97237e3")
    .subscribe({
      next: (data:any) => {
        this.Pubs = data;
        console.log(this.Pubs);
      },
      error:(e) => console.log(e)
    })
  };

}
