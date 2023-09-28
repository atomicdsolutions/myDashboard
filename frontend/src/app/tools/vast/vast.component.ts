import { Component } from '@angular/core';
import { VastService } from 'src/app/service/vast.service';

@Component({
  selector: 'app-vast',
  templateUrl: './vast.component.html',
  styleUrls: ['./vast.component.scss']
})
export class VastComponent {
  xmlUrl = '';
  jsonData: any;
  responseTime = 0;

  constructor(private vast: VastService) { }

  getVast() {
    const startTime = new Date().getTime();
    this.vast.getResponse(this.xmlUrl)
      .then((data: any) => {
        this.responseTime = new Date().getTime() - startTime;
        this.jsonData = data;
      }).catch(err => {
        console.log(err);
      });
  }
}
