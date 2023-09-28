import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Publisher } from '../models/publisher.model';

@Injectable({
  providedIn: 'root'
})
export class ApiGatewayService {

  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient) { }


  getUsagePlan(publisher: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-usage-plan`,publisher);
  }

  getUsage(publisher:Publisher): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-usage`,publisher );
  }
  getPreviousMonthUsage(publisher:Publisher): Observable<any> {
    return this.http.post(`${this.baseUrl}/get-previous-month-usage`,publisher );
  }
  getApiKeys(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-api-keys`);
  }
}
