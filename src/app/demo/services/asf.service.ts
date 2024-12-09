import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeAsf, DemandeAsfResponse } from '../models/asf';

@Injectable({
  providedIn: 'root'
})
export class AsfService {

  private apiUrl = 'http://195.35.48.198:8083/api/demandes'; 

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
    return this.http.post(`${this.apiUrl}`, requestData, {
      headers: this.getHeaders()
    });
  }

  getDemandes(): Observable<DemandeAsfResponse> {
    return this.http.get<DemandeAsfResponse>(`${this.apiUrl}`, {
      headers: this.getFormDataHeaders()
    }); 
  }

  getOneDemande(requestId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${requestId}`, {
      headers: this.getFormDataHeaders()
    });
  }
}
