import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeAje, DemandeAjeResponse } from '../models/aje';

@Injectable({
  providedIn: 'root'
})
export class AjeService {

  private apiUrl = 'http://54.37.13.176:8082/api/demandes'; 

  constructor(private http: HttpClient) {}

  submitAttestationRequest(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, formData);
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

  approveRequest(requestId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/${requestId}/approve`, formData);
}

}
