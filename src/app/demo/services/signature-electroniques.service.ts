import { Injectable } from '@angular/core';
import { HttpFastserviceService } from './http-fastservice.service';
import { CreateUserRequest, Utilisateur } from '../models/utilisateurs';
import { API_ROOT } from 'src/environments/environment';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignatureElectroniquesService {

    private apiUrl = 'https://gump-gateway.yulpay.com/api/demandes?service=drtss-ms';
    private apiGateway = 'https://gump-gateway.yulpay.com/api';
    // private apiUrl = 'http://195.35.48.198:8082/api/demandes';
    // private token = this.keycloak.getToken();
    private token = localStorage.getItem('currentToken');

    // Méthode pour obtenir les headers avec le token Bearer
    private getHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      });
    }

    // Méthode pour obtenir les headers spécifiques pour FormData
    private getFormDataHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
    }

  constructor(private fastService:HttpFastserviceService, private http: HttpClient) {  }


  public listUtilisateurDrtss(page: number, size: number) {
    return this.fastService.get<Utilisateur[]>(`${API_ROOT.API_LISTE_USERS_DRTSS}?page=${page}&size=${size}`).pipe(
       tap((utilisateurs) => {
          console.log("Liste des utilisateurs récupérée :", utilisateurs);
       }),
       catchError((error) => {
          console.error("Erreur lors de la récupération des utilisateurs :", error);
          return of([]);
       })
    );
 }

 public listUtilisateurSignataieDrtss(page: number, size: number) {
    return this.fastService.get<Utilisateur[]>(`${API_ROOT.API_LISTE_USERS_SIGNATAIRE_DRTSS}?page=${page}&size=${size}`).pipe(
       tap((utilisateurs) => {

    }),
       catchError((error) => {

        return of([]);
       })
    );
 }


 public listDemandes(page: number, size: number) {
    return this.fastService.get<Utilisateur[]>(`${API_ROOT.API_LISTE_DEMANDES}?page=${page}&size=${size}`).pipe(
       tap((utilisateurs) => {

    }),
       catchError((error) => {
           return of([]);

        })
    );
 }

 public listRegions() {
    return this.fastService.get<any[]>(`${API_ROOT.API_LISTE_REGIONS}`).pipe(
       tap((regions) => {
        console.log('Liste region',regions);

    }),
       catchError((error) => {
           return of([]);

        })
    );
 }

  public creerUtilisateurDrtss(formData: FormData) {
    return this.fastService.post<Utilisateur>(API_ROOT.API_CREATE_USERS_DRTSS, formData).pipe(
      tap((res: Utilisateur) => {
        console.log("Utilisateur enregistré :", res);
      }),
      catchError(error => {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
         return of(null);
      })
    );
  }


 public createUserRequest(formData: any): Observable<any> {
    return this.fastService.post<CreateUserRequest>(API_ROOT.API_USERS_COMPTE_REQUEST, formData).pipe(
        tap((res: CreateUserRequest) => {
          console.log("Utilisateur enregistré :", res);
        }),
        catchError(error => {
          console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
           return of(null);
        })
      );
}

   // Méthode pour créer un utilisateur
public   createUserCompte(createUserRequest: CreateUserRequest): Observable<void> {
    return this.fastService.post<void>(`${API_ROOT.API_SIGNE_ATTESTATION_DRTSS}`, createUserRequest);
  }
  public modifierStatusUtilisateurDrtss(idUser:number) {
    return this.fastService.post<Utilisateur>(API_ROOT.API_UPDATE_STATUS_USERS_DRTSS, {"id":idUser}).pipe(
      tap((res: Utilisateur) => {
        console.log("Utilisateur enregistré :", res);
      }),
      catchError(error => {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
         return of(null);
      })
    );
  }

  public telechargerCertificat(path: string,certificatFile:any): void {

    const url = API_ROOT.API_DOWNLOAD_SIGNATAIRE_CERTIFICAT_DRTSS+`?path=${encodeURIComponent(path)}`;

    this.http.get(url, { responseType: 'blob' }).subscribe(
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
        (error) => {
         }
    );
}




public getSignatoryByEmail(email:String) {
    return this.fastService.get<any[]>(`${API_ROOT.API_GET_SIGNATAIRE_BY_MAIL+email}`).pipe(
        tap((regions) => {
         console.log('Liste region',regions);

     }),
        catchError((error) => {
            return of([]);

         })
     );
  }


  public toggleSignatoryStatus(id: number) {
    return this.fastService.post<any>(`${API_ROOT.API_TOGGLE_SIGNATORY_STATUS+id}`,{}).pipe(
       tap((utilisateurs) => {

    }),
       catchError((error) => {

        return of([]);
       })
    );
 }




  public createSignataire(selectedFile: File, selectedUser: { id: number }) {
    const formData: FormData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', selectedUser.id.toString());

    return this.fastService.post<any>(`${API_ROOT.API_CREATE_SIGNATAIRE_DRTSS}`, formData).pipe(
      tap((res) => {
        console.log('Signataire enregistré avec succès :', res);
      }),
      catchError((error) => {
        console.error('Erreur lors de l\'enregistrement du signataire :', error);
        return of(null);
      })
    );
  }



  public signDocument(
    selectedFile: File,
    signatoryId: number,
    attestationPath: string,
    alias: string,
    keyStorePassword: string
): Observable<any> {
    const formData = new FormData();
    formData.append('keyStore', selectedFile);
    formData.append('signatoryId', signatoryId.toString());
    formData.append('attestationPath', attestationPath);
    formData.append('alias', alias);
    formData.append('keyStorePassword', keyStorePassword);


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



}
