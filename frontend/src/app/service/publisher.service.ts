import { Injectable } from '@angular/core';
import { Publisher } from '../models/publisher.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
const baseUrl = environment.Server_URL;

@Injectable({
  providedIn: 'root'
})
export class PublisherService {

  constructor(private http: HttpClient) { }
  createPublisher(data: any): Observable<any> {
    return this.http.post(baseUrl + "/publisher", data);
  }
  updatePublisher(id: any, data: any): Observable<any> {
    return this.http.put(baseUrl + "/publisher/" + id, data);
  }
  deletePublisher(id: any): Observable<any> {
    return this.http.delete(baseUrl + "/publisher/" + id);
  }
  findByNamePublisher(name: any): Observable<Publisher[]> {
    return this.http.get<Publisher[]>(baseUrl + "/publlisher?name=" + name);
  }
  getAllPublishers(): Observable<any[]> {
    return this.http.get<any>(baseUrl+ "/publishers" );
  }
  getPub(id: any): Observable<any> {
    return this.http.get<Publisher>(baseUrl + "/publiser/" + id);
  }

  
}
