import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeRccm, DemandeRccmResponse } from '../models/rccm';

@Injectable({
  providedIn: 'root'
})
export class RccmService {

  private apiUrl = 'http://54.37.13.176:8082/api/demandes'; 

  constructor(private http: HttpClient) {}

  submitAttestationRequest(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  getDemandes(): Observable<DemandeRccmResponse> {
    return this.http.get<DemandeRccmResponse>(this.apiUrl);
  }

  getRequestStatus(requestId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${requestId}`);
  }

  getOneDemande(requestId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${requestId}`);
  }

  approveRequest(requestId: number, requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/approve`, requestData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  reviewRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/review?status=PROCESSING`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
