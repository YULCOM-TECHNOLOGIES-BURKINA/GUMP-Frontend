import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeAje, DemandeAjeResponse } from '../models/aje';

@Injectable({
  providedIn: 'root'
})
export class AjeService {

 private apiUrl = 'http://localhost:9090/api/demandes';

  constructor(private http: HttpClient) {}

  private token = localStorage.getItem('currentToken');

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  private getFormDataHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  submitAttestationRequest(requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}?service=tresor-ms`, requestData, {
      headers: this.getHeaders()
    });
  }

  getDemandes(): Observable<DemandeAjeResponse> {
    return this.http.get<DemandeAjeResponse>(`${this.apiUrl}?service=tresor-ms`, {
      headers: this.getFormDataHeaders()
  });
  }

  getOneDemande(requestId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${requestId}?service=tresor-ms`, {
      headers: this.getFormDataHeaders()
  });
  }

  approveRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/approve?service=tresor-ms`, {
      headers: this.getHeaders()
    });
  }

}
