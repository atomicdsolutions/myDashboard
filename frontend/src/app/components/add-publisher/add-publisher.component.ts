import { Component, OnInit } from '@angular/core';
import { Publisher } from 'src/app/models/publisher.model';
import { PublisherService } from 'src/app/service/publisher.service';


@Component({
  selector: 'app-add-publisher',
  templateUrl: './add-publisher.component.html',
  styleUrls: ['./add-publisher.component.scss']
})
export class AddPublisherComponent implements OnInit {
  pub: Publisher = {
    name: '',
    showCount: 0,
    published: '',
    user: '',
    apiKey: '',
    podApiKey: '',
    email: '',
    website: '',
    instance: '',
    type: '',
    agency: 0,
    awsApikey: '',
    awsApiUsagePlan: '',
    imported: false
  };
  submitted = false
  // Variable to control visibility
  showCSV: boolean = false; // Hide CSV upload by default

  // This will hold the uploaded CSV file
  fileToUpload: File | null = null;

  constructor(private pubService: PublisherService) { }

  ngOnInit(): void {
  }
  savePublisher(): void {
    const data = {
      name: this.pub.name,
      showCount: this.pub.showCount,
      published: this.pub.published,
      user: this.pub.user,
      apiKey: this.pub.apiKey,
      podApiKey: this.pub.podApiKey,
      email: this.pub.email,
      website: this.pub.website,
      instance: this.pub.instance,
      type: this.pub.type,
      agency: this.pub.agency,
      awsApikey: this.pub.awsApikey,
      awsApiUsagePlan: this.pub.awsApiUsagePlan,
      imported: false
    };
    this.pubService.createPublisher(data)
      .subscribe({
        next: (res) => {
          console.log(data);
          this.submitted = true;
        },
        error: (e) => console.log(e)
      });
  }
  newPublisher(): void {
    this.submitted = false;
    this.pub = {
      name: '',
      showCount: 0,
      published: '',
      user: '',
      apiKey: '',
      podApiKey: '',
      email: '',
      website: '',
      instance: '',
      type: '',
      agency: 0,
      awsApikey: '',
      awsApiUsagePlan: '',
      imported: false
    };
  }
  // Handle the file input change event
  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileToUpload = input.files[0];
    } else {
      console.error('No files selected');
    }
  }

  // Parse the CSV and add publishers
  addPublishersFromCSV() {
    if (!this.fileToUpload) {
      console.error('No file selected');
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsText(this.fileToUpload, "UTF-8");
    fileReader.onload = () => {
      // Parse CSV and add publishers
      // You can use this.pubService.createPublisher(data) here
      const csvData = fileReader.result;
      const allTextLines = (<string>csvData).split(/\r|\n|\r/);
      const headers = allTextLines[0].split(',');
      const lines = [];
      for (let i = 1; i < allTextLines.length; i++) {
        const data = allTextLines[i].split(',');
        if (data.length == headers.length) {
          console.log(data[10]);
          const publisherData = {
            name: data[0],
            showCount: data[1],
            published: data[2],
            user: data[3],
            apiKey: data[4],
            podApiKey: data[5],
            email: data[6],
            website: data[7],
            instance: data[8],
            type: data[9],
            agency: data[10],
            awsApikey: data[11],
            awsApiUsagePlan: data[12],
            imported: false
          };
          this.addPublisherFromCSV(publisherData);
        }
      }
    }
    fileReader.onerror = (error) => {
      console.error('Error reading the CSV file', error);
    }
  }
  
  addPublisherFromCSV(publisher: Publisher) {
    this.pubService.createPublisher(publisher)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

}
