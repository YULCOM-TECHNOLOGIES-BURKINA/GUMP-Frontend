import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeAje, DemandeAjeResponse } from '../models/aje';

@Injectable({
  providedIn: 'root'
})
export class AjeService {

  private apiUrl = 'http://195.35.48.198:8080/api/demandes';

  constructor(private http: HttpClient) {}

  // submitAttestationRequest(formData: FormData): Observable<any> {
  //   return this.http.post(`${this.apiUrl}`, formData);
  // }

  submitAttestationRequest(requestData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, requestData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getDemandes(): Observable<DemandeAjeResponse> {
    return this.http.get<DemandeAjeResponse>(this.apiUrl);
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
