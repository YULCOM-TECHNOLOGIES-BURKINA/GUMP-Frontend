import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrtssService {

  constructor(private http: HttpClient) {}

  private apiGateway = 'https://gump-gateway.yulpay.com/api';
  private token = localStorage.getItem('currentToken');

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  verifyDrtps(documentId: number): Observable<any> {
    return this.http.get(`${this.apiGateway}/verify-document/${documentId}?service=drtss-ms`, {
      headers: this.getHeaders()
    });
  }

  verifyAje(documentId: number): Observable<any> {
    return this.http.get(`${this.apiGateway}/verify-document/${documentId}?service=tresor-ms`, {
      headers: this.getHeaders()
    });
  }
}
