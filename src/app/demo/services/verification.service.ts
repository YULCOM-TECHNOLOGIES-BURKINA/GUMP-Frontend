import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  verifyASF(data: VerifyASFData): Observable<Blob> {
    return this.http.post(`${this.apiGateway}/verify_asf_doc?service=asf-ms`, 
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
}