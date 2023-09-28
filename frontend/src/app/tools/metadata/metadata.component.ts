import { Component} from '@angular/core';
import { MetadataService } from 'src/app/service/metadata.service';



@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss']
})
export class MetadataComponent  {
  url!: string;
metadata: any;
  constructor(private metadataService: MetadataService) { }

  ngOnInit(){
  }
  getMetadata(){
    this.metadataService.getMetadata(this.url)
    
  }
}




 