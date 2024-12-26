import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { API_ROOT } from 'src/environments/environment';
import { HttpFastserviceService } from './http-fastservice.service';

@Injectable({
    providedIn: 'root',
})
export class ApplicationConfigService {
    private apiUrl =
        'https://gump-gateway.yulpay.com/api/demandes?service=drtss-ms';
    _gateway = 'https://gump-gateway.yulpay.com/api/';
    _ms_drtss = 'service=drtss-ms';
    _ms_users = 'service=users-ms';
    _ms_aje = 'service=tresor-ms';

    private token = localStorage.getItem('currentToken');

    constructor(
        private fastService: HttpFastserviceService,
        private http: HttpClient
    ) {}

    public getConfigDrtps(): Observable<any> {
        return this.fastService
            .get<any>(
                `${this._gateway + 'application-config?' + this._ms_drtss}`
            )
            .pipe(
                tap((res) => {}),
                catchError((error) => {
                    return throwError(() => new Error('Échec'));
                })
            );
    }

    public getConfigAje(): Observable<any> {
        return this.fastService
            .get<any>(`${this._gateway + 'application-config?' + this._ms_aje}`)
            .pipe(
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

        return this.fastService
            .post<any>(
                `${this._gateway + 'application-config?' + this._ms_drtss}}`,
                formData
            )
            .pipe(
                tap((res) => {
                    console.log('Attestation signée avec succès :', res);
                }),
                catchError((error) => {
                    console.error('Erreur lors de la signature :', error);
                    return throwError(
                        () =>
                            new Error('Échec de la signature de l’attestation.')
                    );
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
        return this.http.put(
            `${this._gateway + 'application-config?' + this._ms_drtss}`,
            formData,
            { headers }
        );
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
        return this.http.put(
            `${this._gateway + 'application-config?' + this._ms_aje}`,
            formData,
            { headers }
        );
    }
}
