import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeAsf, DemandeAsfResponse } from '../models/asf';

@Injectable({
  providedIn: 'root'
})
export class AsfService {

  private apiUrl = 'https://gump-gateway.yulpay.com/api';

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
    return this.http.post(`${this.apiUrl}/demandes?service=asf-ms`, requestData, {
      headers: this.getHeaders()
    });
  }

   downloadAsf(data: { ifu: string, nes: string, reference: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/telecharger?service=asf-ms`, data, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  getDemandesHistory(data: { ifu: string, nes: string }): Observable<any> {
    return this.http.get(`${this.apiUrl}/demandes?service=asf-ms`, {
      headers: this.getHeaders(),
      params: data 
    });
  }

  getDemandes(): Observable<DemandeAsfResponse> {
    return this.http.get<DemandeAsfResponse>(`${this.apiUrl}?service=asf-ms`, {
      headers: this.getFormDataHeaders()
    });
  }

  // getOneDemande(requestId: number): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/${requestId}`, {
  //     headers: this.getFormDataHeaders()
  //   });
  // }


    // 3. Consulter le statut d'une demande
    // checkStatus(data: { ifu: string, nes: string, reference: string }): Observable<any> {
    //   return this.http.post(`${this.baseUrl}/statut`, data, {
    //     headers: this.getHeaders()
    //   });
    // }


    // // 5. Vérifier une demande ASF
    // verifyAsf(data: { ifu: string, nes: string, attestation: string }): Observable<any> {
    //   return this.http.post(`${this.baseUrl}/verifier`, data, {
    //     headers: this.getHeaders()
    //   });
    // }

    // // 6. Détails d'une demande ASF
    // getDemandeDetails(data: { ifu: string, nes: string, reference: string }): Observable<any> {
    //   return this.http.post(`${this.baseUrl}/details`, data, {
    //     headers: this.getHeaders()
    //   });
    // }
}
