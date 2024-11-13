import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeCnss, DemandeCnssResponse } from '../models/cnss';

@Injectable({
  providedIn: 'root'
})
export class CnssService {

  private apiUrl = 'http://localhost:8082/api/demandes';

  constructor(private http: HttpClient) {}

  submitAttestationRequest(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
  }

  getDemandes(): Observable<DemandeCnssResponse> {
    return this.http.get<DemandeCnssResponse>(this.apiUrl);
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
