import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeAsf, DemandeAsfResponse } from '../models/asf';

@Injectable({
  providedIn: 'root'
})
export class AsfService {

  private apiUrl = 'http://54.37.13.176:8080/api/demandes'; 

  constructor(private http: HttpClient) {}

  submitAttestationRequest(requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, requestData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getDemandes(): Observable<DemandeAsfResponse> {
    return this.http.get<DemandeAsfResponse>(this.apiUrl); 
  }

  getRequestStatus(requestId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${requestId}`);
  }

  getOneDemande(requestId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${requestId}`);
  }

  approveRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/approve`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  reviewRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/review?status=PROCESSING`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

}
