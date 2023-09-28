import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { parse } from 'id3-parser';
import { convertFileToBuffer, fetchFileAsBuffer } from 'id3-parser/lib/universal/helpers';
import universalParse from 'id3-parser/lib/universal';



@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  
    constructor(private http: HttpClient) { }

    getMetadata(url: string) {
    //   fetchFileAsBuffer(url).then(parse).then(tag => {
    //     console.log(tag);
    // });
    universalParse(url).then(tag => {
      console.log(tag);
  });
    }
}