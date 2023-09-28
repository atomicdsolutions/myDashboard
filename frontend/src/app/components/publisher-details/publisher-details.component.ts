import { Component, Input, OnInit } from '@angular/core';
import { Publisher } from 'src/app/models/publisher.model';

@Component({
  selector: 'app-publisher-details',
  templateUrl: './publisher-details.component.html',
  styleUrls: ['./publisher-details.component.scss']
})
export class PublisherDetailsComponent implements OnInit {
  @Input() viewMode = false;
  @Input() currentPublisher: Publisher = {
    name: '',
    showCount: 0,
    user: '',
    apiKey: ''
  };
  constructor() { }

  ngOnInit(): void {
  }

}
