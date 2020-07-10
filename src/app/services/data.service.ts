import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private client_id = 'RWqQtjagHeAgnks6UggVWb9SolORSr1X8N2HZByIiLs';
  private endpointGetByTerm = 'https://api.unsplash.com/search/photos';
  private endpointRandom = 'https://api.unsplash.com/photos';
  constructor(private httpClient: HttpClient) { }

  getImgByTerm(query: string, pageNumber: string): Observable<any>{
    let params = new HttpParams();
    params = params.append('client_id', this.client_id);
    params = params.append('query', query);
    params = params.append('page', pageNumber);
    params = params.append('per_page', '10');
    return this.httpClient.get(this.endpointGetByTerm,{params: params});
  }
  getRandomPictures(): Observable<any> {
    let params = new HttpParams();
    params = params.append('client_id', this.client_id);
    return this.httpClient.get(this.endpointRandom,{params: params});
  }
}
