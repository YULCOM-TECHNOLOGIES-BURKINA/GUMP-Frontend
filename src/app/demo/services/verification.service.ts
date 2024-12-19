// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class VerificationService {

//   constructor(private http: HttpClient) {}

//   private apiGateway = 'https://gump-gateway.yulpay.com/api';
//   private token = localStorage.getItem('currentToken');

//   private getHeaders(): HttpHeaders {
//     return new HttpHeaders({
//       'Authorization': `Bearer ${this.token}`,
//       'Content-Type': 'application/json'
//     });
//   }

//   verifyDrtps(documentId: number): Observable<any> {
//     return this.http.get(`${this.apiGateway}/verify-document/${documentId}?service=drtss-ms`, {
//       headers: this.getHeaders()
//     });
//   }

//   verifyAje(documentId: number): Observable<any> {
//     return this.http.get(`${this.apiGateway}/verify-document/${documentId}?service=tresor-ms`, {
//       headers: this.getHeaders()
//     });
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface VerifyASFData {
  reference: string;
  nes: string;
  ifu: string;
}

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private apiGateway = 'https://gump-gateway.yulpay.com/api';

  constructor(private http: HttpClient) {}

  verifyDocument(type: string, reference: string): Observable<any> {
    const serviceMap = {
      'DRTPS': 'drtss-ms',
      'CNSS': 'cnss-ms',
      'AJE': 'tresor-ms',
      'ANPE': 'anpe-ms',
      'RCCM': 'rccm-ms',
      'CNF': 'cnf-ms'
    };

    const service = serviceMap[type];
    if (!service) {
      throw new Error(`Service non pris en charge pour le type: ${type}`);
    }

    return this.http.get(`${this.apiGateway}/verify-document/${reference}?service=${service}`);
  }

  verifyASF(data: VerifyASFData): Observable<any> {
    return this.http.post(`${this.apiGateway}/verify-document?service=asf-ms`, data);
  }
}