import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, EMPTY, expand, Observable, reduce, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
const scUrl = environment.SC_API_URL;
let header = new HttpHeaders().set("Authorization", "Bearer " + environment.SC_API_Key);
@Injectable({
  providedIn: 'root'
})
export class SimplecastService {
  shows: any = [];
  constructor(private http: HttpClient) { }
  
  getRssFeed(awCollectionId: any): Observable<any[]> {
    delay(5000);
    return this.http.get<any>(scUrl + "/podcasts/" + awCollectionId + "?is_pending_invitation=false", { headers: header });
  }

  getremoteshows(url: string,): Observable<any[]> {

    let rows =[];
    return this.http.get<any>(url, { headers: header })
      .pipe(
        delay(5000),
        expand(response => response.pages.next ? this.http.get(response.pages.next.href, { headers: header }) : EMPTY),
        reduce((acc, current: any) => acc.concat(current.collection), [])
      );
  }

}
