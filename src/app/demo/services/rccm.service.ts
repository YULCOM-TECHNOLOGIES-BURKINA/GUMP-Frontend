import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeRccm, DemandeRccmResponse } from '../models/rccm';

@Injectable({
  providedIn: 'root'
})
export class RccmService {
  private apiUrl = 'https://gump-gateway.yulpay.com/api/demandes';

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
      'Authorization': `Bearer ${this.token}`,
      // 'Content-Type': 'multipart/form-data'
    });
  }

  submitAttestationRequest(file: File, immatriculationDate: string, typeDemande: string): Observable<any> {
    const formData = new FormData();
    
    formData.append('extraitRccm', file);

    const params = new HttpParams()
    .set('immatriculationDate', immatriculationDate)
    .set('typeDemande', typeDemande);

    return this.http.post(`${this.apiUrl}?service=justice-ms`, formData, {
      headers: this.getFormDataHeaders(),
      params: params
    });
  }

  getDemandes(): Observable<DemandeRccmResponse> {
    return this.http.get<DemandeRccmResponse>(`${this.apiUrl}?service=justice-ms`, {
      headers: this.getHeaders(),
    });
  }

  getOneDemande(requestId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${requestId}?service=justice-ms`, {
      headers: this.getHeaders(),
    });
  }  
}
