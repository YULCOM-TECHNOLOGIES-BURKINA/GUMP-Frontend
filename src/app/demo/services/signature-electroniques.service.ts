import { Injectable } from '@angular/core';
import { HttpFastserviceService } from './http-fastservice.service';
import { CreateUserRequest, Utilisateur } from '../models/utilisateurs';
import { API_ROOT } from 'src/environments/environment';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class SignatureElectroniquesService {
    private apiUrl =
        'https://gump-gateway.yulpay.com/api/demandes?service=drtss-ms';

    // private apiGateway = 'https://gump-gateway.yulpay.com/api/';

    _gateway = 'https://gump-gateway.yulpay.com/api/';
    _ms_drtss = 'service=drtss-ms';
    _ms_users = 'service=users-ms';

    private token = localStorage.getItem('currentToken');

    // Méthode pour obtenir les headers avec le token Bearer
    private getHeaders(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        });
    }

    // Méthode pour obtenir les headers spécifiques pour FormData
    private getFormDataHeaders(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${this.token}`,
        });
    }

    constructor(
        private fastService: HttpFastserviceService,
        private http: HttpClient
    ) {}

    public listUtilisateurDrtss(page: number, size: number) {
        return this.fastService
            .get<Utilisateur[]>(
                this._gateway +
                    `users?page=${page}&size=${size}&userType=DRTSS_USER&${this._ms_users}`
            )
            .pipe(
                tap((utilisateurs) => {
                    console.log(
                        'Liste des utilisateurs récupérée :',
                        utilisateurs
                    );
                }),
                catchError((error) => {
                    console.error(
                        'Erreur lors de la récupération des utilisateurs :',
                        error
                    );
                    return of([]);
                })
            );
    }

    public listUtilisateurAje(page: number, size: number) {
        return this.fastService
            .get<Utilisateur[]>(
                this._gateway +
                    `users?page=${page}&size=${size}&userType=TRESOR_USER&${this._ms_users}`
            )
            .pipe(
                tap((utilisateurs) => {
                    console.log(
                        'Liste des utilisateurs récupérée :',
                        utilisateurs
                    );
                }),
                catchError((error) => {
                    console.error(
                        'Erreur lors de la récupération des utilisateurs :',
                        error
                    );
                    return of([]);
                })
            );
    }

    public listUtilisateurSignataieDrtss(page: number, size: number) {
        return this.fastService
            .get<Utilisateur[]>(
                this._gateway +
                    `signature_electronique/liste_signataire?page=${page}&size=${size}` +
                    '&' +
                    this._ms_drtss
            )
            .pipe(
                tap((utilisateurs) => {}),
                catchError((error) => {
                    return of([]);
                })
            );
    }

    public listDemandes(page: number, size: number) {
        return this.fastService
            .get<Utilisateur[]>(this._gateway + `demandes?` + this._ms_drtss)
            .pipe(
                tap((utilisateurs) => {}),
                catchError((error) => {
                    return of([]);
                })
            );
    }

    public listRegions() {
        return this.fastService
            .getWithoutToken<any[]>(`${API_ROOT.API_LISTE_REGIONS}`)
            .pipe(
                tap((regions) => {}),
                catchError((error) => {
                    return of([]);
                })
            );
    }

    public creerUtilisateurDrtss(formData: FormData) {
        return this.fastService
            .post<Utilisateur>(API_ROOT.API_CREATE_USERS_DRTSS, formData)
            .pipe(
                tap((res: Utilisateur) => {}),
                catchError((error) => {
                    console.error(
                        "Erreur lors de l'enregistrement de l'utilisateur :",
                        error
                    );
                    return of(null);
                })
            );
    }

    public createUserRequest(formData: any): Observable<any> {
        return this.fastService
            .post<CreateUserRequest>(
                this._gateway + 'users?' + this._ms_users,
                formData
            )
            .pipe(
                tap((res: CreateUserRequest) => {}),
                catchError((error) => {
                    console.error(
                        "Erreur lors de l'enregistrement de l'utilisateur :",
                        error
                    );
                    return of(null);
                })
            );
    }

    public updateUserRequest(formData: any): Observable<any> {
        return this.fastService
            .post<CreateUserRequest>(
                this._gateway + 'users/update?' + this._ms_users,
                formData
            )
            .pipe(
                tap((res: CreateUserRequest) => {}),
                catchError((error) => {
                    console.error(
                        "Erreur lors de l'enregistrement de l'utilisateur :",
                        error
                    );
                    return of(null);
                })
            );
    }

    public createUserCompte(
        createUserRequest: CreateUserRequest
    ): Observable<void> {
        return this.fastService.post<void>(
            this._gateway +
                `signature_electronique/sign_attestation&` +
                this._ms_drtss,
            createUserRequest
        );
    }
    public modifierStatusUtilisateurDrtss(idUser: number) {
        return this.fastService
            .get<Utilisateur>(
                this._gateway + 'user/' + idUser + '/toggle?' + this._ms_users
            )
            .pipe(
                tap((res: Utilisateur) => {}),
                catchError((error) => {
                    console.error(
                        "Erreur lors de l'enregistrement de l'utilisateur :",
                        error
                    );
                    return of(null);
                })
            );
    }

    public telechargerCertificat(path: string, certificatFile: any): void {
        const url =
            this._gateway +
            `signature_electronique/download_certificate?path=${encodeURIComponent(
                path
            )}` +
            '&' +
            this._ms_drtss;

        this.http
            .get(url, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            })
            .subscribe(
                (res: Blob) => {
                    if (res.size > 0) {
                        const blobUrl = window.URL.createObjectURL(res);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = certificatFile;
                        a.click();
                        window.URL.revokeObjectURL(blobUrl);
                    } else {
                    }
                },
                (error) => {}
            );
    }

    public getSignatoryByEmail(email: String) {
        return this.fastService
            .get<any[]>(
                this._gateway +
                    'signature_electronique/signataire/' +
                    email +
                    '?' +
                    this._ms_drtss
            )
            .pipe(
                tap((regions) => {}),
                catchError((error) => {
                    return of([]);
                })
            );
    }

    public getUsersInfoByEmail(email: String) {
        return this.fastService
            .get<any[]>(
                this._gateway + 'users/' + email + '/email?' + this._ms_users
            )
            .pipe(
                tap((user) => {}),
                catchError((error) => {
                    return of([]);
                })
            );
    }

    public toggleSignatoryStatus(id: number) {
        return this.fastService
            .post<any>(
                this._gateway +
                    'signature_electronique/toggle_status/' +
                    `${id}` +
                    '?' +
                    this._ms_drtss,
                {}
            )
            .pipe(
                tap((utilisateurs) => {}),
                catchError((error) => {
                    return of([]);
                })
            );
    }

    public createSignataire(selectedFile: File, selectedUser: { id: number }) {
        const formData: FormData = new FormData();
        formData.append('file', selectedFile);
        formData.append('userId', selectedUser.id.toString());

        return this.fastService
            .postFile<any>(
                this._gateway +
                    'signature_electronique/create_signataire?userId=' +
                    selectedUser.id +
                    '&' +
                    this._ms_drtss,
                formData
            )
            .pipe(
                tap((res) => {
                    console.log('Signataire enregistré avec succès :', res);
                }),
                catchError((error) => {
                    console.error(
                        "Erreur lors de l'enregistrement du signataire :",
                        error
                    );
                    return of(null);
                })
            );
    }

    public signDocument(
        signatoryId: string,
        demandeId: string,
        attestationPath: string
    ): Observable<any> {
        const formData = new FormData();
        formData.append('signatoryId', signatoryId);
        formData.append('requestId', demandeId);
        formData.append('attestationPath', attestationPath);
        console.log(signatoryId, demandeId, attestationPath);

        return this.fastService
            .post<any>(
                `${
                    this._gateway +
                    'signature_electronique/sign_attestation&' +
                    this._ms_drtss
                }`,
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



    /**
     * Vérifie si un utilisateur avec un rôle donné existe dans une région donnée.
     * @param role Rôle de l'utilisateur
     * @param region Région de l'utilisateur
     * @returns Un Observable contenant un boolean
     */
    checkUserExists(role: string, region: string): Observable<boolean> {
        return this.fastService.get<boolean>(
            `${this._gateway}users/exists?role=${role}&region=${region}&` +
                this._ms_users
        );
    }

    approveRequestSigned(id:string) {
  return this.fastService.get<boolean>(
      `${this._gateway}signature_electronique/demandes/${id}/signed?` +
          this._ms_drtss
  );
    }
}
