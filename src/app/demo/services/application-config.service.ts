import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { API_ROOT } from 'src/environments/environment';
import { HttpFastserviceService } from './http-fastservice.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationConfigService {

    constructor(private fastService:HttpFastserviceService, private http: HttpClient) {  }




  public getConfigDrtps(): Observable<any> {

    return this.fastService.get<any>(`${API_ROOT.API_CONFIG_DRTPS}`).pipe(
        tap((res) => {
            console.log('Config :', res);
        }),
        catchError((error) => {
            console.error('Erreur :', error);
            return throwError(() => new Error('Échec'));
        })
    );
}


public getConfigAje(): Observable<any> {

    return this.fastService.get<any>(`${API_ROOT.API_CONFIG_AJE}`).pipe(
        tap((res) => {
            console.log('Config :', res);
        }),
        catchError((error) => {
            console.error('Erreur :', error);
            return throwError(() => new Error('Échec'));
        })
    );
}



public updateConfigDrtps(): Observable<any> {
    const formData = new FormData();

    return this.fastService.post<any>(`${API_ROOT.API_SIGNE_ATTESTATION_DRTSS}`, formData).pipe(
        tap((res) => {
            console.log('Attestation signée avec succès :', res);
        }),
        catchError((error) => {
            console.error('Erreur lors de la signature :', error);
            return throwError(() => new Error('Échec de la signature de l’attestation.'));
        })
    );
}





  updateApplicationConfigDrtps(file: File, configData: any): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('logo', file, file.name);

    formData.append(
      'updateApplicationConfigRequest',
      new Blob([JSON.stringify(configData)], { type: 'application/json' })
    );

    const headers = new HttpHeaders({
      Accept: '*/*',
    });
     return this.http.put(API_ROOT.API_CONFIG_DRTPS, formData, { headers });
  }


  updateApplicationConfigAje(file: File, configData: any): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('logo', file, file.name);

    formData.append(
      'updateApplicationConfigRequest',
      new Blob([JSON.stringify(configData)], { type: 'application/json' })
    );

    const headers = new HttpHeaders({
      Accept: '*/*',
    });
     return this.http.put(API_ROOT.API_CONFIG_AJE, formData, { headers });
  }

}
