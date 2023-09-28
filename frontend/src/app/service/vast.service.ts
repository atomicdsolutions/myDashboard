import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as xml2js from 'xml2js';
@Injectable({
  providedIn: 'root'
})
export class VastService {
  jsonData: any;

  constructor(private http: HttpClient) { }

  getResponse(vastUrl: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(vastUrl, { responseType: 'text' })
        .subscribe((data: any) => {
          xml2js.parseString(data, (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
    });
  }

}