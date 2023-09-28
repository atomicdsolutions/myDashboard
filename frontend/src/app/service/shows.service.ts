import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Show } from '../models/show.model';

import { environment } from 'src/environments/environment';
const baseUrl = environment.Server_URL;



@Injectable({
  providedIn: 'root'
})
export class ShowsService {
  constructor(private http: HttpClient) { }

  getShow(id: any): Observable<Show> {
    return this.http.get(baseUrl + "/show/" + id);
  }
  createShow(data: any): Observable<any> {
    return this.http.post(baseUrl + "/show", data);
  }

  updateShow(id: any, data: any): Observable<any> {
    return this.http.put(baseUrl + "/show/" + id, data);
  }

  deleteShow(id: any): Observable<any> {
    return this.http.delete(baseUrl + "/show" + id);
  }

  deleteAllShows(): Observable<any> {
    return this.http.delete(baseUrl + "/show");
  }
  deleteAllPublishers(): Observable<any> {
    return this.http.delete(baseUrl + "/publisher");
  }
  findByNameShow(name: any): Observable<Show[]> {
    return this.http.get<Show[]>(baseUrl + "/show?name=" + name);
  }
  findbyPublisherId(publisherId: any): Observable<Show[]> {
    return this.http.get<Show[]>(baseUrl + "/shows?publisherId=" + publisherId);
  }
  getAllShows(): Observable<any[]> {
    return this.http.get<any>(baseUrl + "/shows/");
  }
  getPublishedCount(): Observable<any>{
    return this.http.get<any>(baseUrl+ "/publishedCount")
  }
}
