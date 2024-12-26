import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ASFData {
  reference: string;
  nes: string;
  ifu: string;
}

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
      // headers: this.getHeaders()
    });
  }

  //  downloadAsf(data: { ifu: string, nes: string, reference: string }): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/telecharger?service=asf-ms`, data, {
  //     headers: this.getHeaders(),
  //     responseType: 'blob'
  //   });
  // }


  downloadAsf(data: ASFData): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/verify_asf_doc?service=asf-ms`,
      data,
      {
        responseType: 'blob',
        observe: 'response'
      }
    ).pipe(
      map(response => {
        if (response.status === 200) {
          return response.body;
        }
        throw new Error('Erreur lors de la vérification');
      })
    );
  }

  getDemandesHistory(data: { ifu: string, nes: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/historique?service=asf-ms`, data, {
      headers: this.getHeaders(),
      // params: data
    });
    }




//   getDemandesHistory(data: { ifu: string, nes: string }): Observable<any> {
//     return this.http.post(`${this.apiUrl}/demandes`, {
//         // headers: this.getHeaders(),
//         params: {
//             ...data,
//             service: 'asf-ms'
//         }
//     });
// }


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
