import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseUrl = environment.Podscribe_URL;

@Injectable({
  providedIn: 'root'
})
export class PodscribeService {

  constructor(private http: HttpClient) { }
  getPublishers(key: any) {
    let header = new HttpHeaders().set("x-api-key",  key);
    return this.http.get(baseUrl + "/publishers", { headers: header });
  };
  addPublisher(publisher: String, key: any, rss: String) {
    let header = new HttpHeaders().set("x-api-key", key);
    let body = {
      publisher: publisher,
      website: rss
    }
    return this.http.put(baseUrl + "/publishers", body, { headers: header });
  };
  
  getShows(key: any) {
    let header = new HttpHeaders().set("x-api-key",  key);
    return this.http.get(baseUrl + "/shows", { headers: header });
  };

}
