import {
    HttpHeaders,
    HttpClient,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HttpFastserviceService {

 _gateway = 'https://gump-gateway.yulpay.com/api/';
 // _gateway = 'http://localhost:9090/api/';

  // Méthode pour obtenir les headers spécifiques pour FormData
  private getFormDataHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }
  private token = localStorage.getItem('currentToken');

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
     // 'Content-Type': 'application/json'
    });
  }


  private getHeadersFile(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
     });
  }

    status!: string;
    errorMessage: any;

    constructor(
        private http: HttpClient,

        protected router: Router
    ) {}

    /**
     * Service CRUD avec gestion des erreurs.
     */

    // POST Method

    public post<T>(url: string, body: Object): Observable<T> {
       return this.http
         .post<T>(url, body,{headers: this.getHeaders()})
         .pipe(
           catchError((error) => this.handleError(error))
         );
     }

     public postFile<T>(url: string, body: Object): Observable<T> {
        return this.http
          .post<T>(url, body,{headers: this.getHeadersFile()})
          .pipe(
            catchError((error) => this.handleError(error))
          );
      }

    // PUT Method
    public put<T>(url: string, body: Object): Observable<T> {
        return this.http
            .put<T>(url, body, { observe: 'body',headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    // PATCH Method
    public patch<T>(url: string, body: Object): Observable<T> {
        return this.http
            .patch<T>(url, body, { observe: 'body',headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    // DELETE Method
    public delete<T>(url: string): Observable<T> {
        return this.http
            .delete<T>(url, { observe: 'body',headers: this.getHeaders() })
            .pipe(catchError(this.handleError));
    }

    // GET Method
    public get<T>(url: string): Observable<T> {
        return this.http
            .get<T>(url, { observe: 'body', headers: this.getHeaders()},)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        console.error('Erreur lors de la requête HTTP :', error.message);
        return throwError(() => new Error('Erreur de requête HTTP'));
    }



    /**
     * Recuperation d'une valeur par la clé de stockage
     * @param key
     * @constructor
     */
    public FunctionStorageGetItem(key: string) {
        return localStorage.getItem(key);
    }

    /**
     * Enregistrer des données dans en local
     * @param key
     * @param value
     * @constructor
     */
    public FunctionStorageSetItem(key: string, value: object) {
        console.log('prochart setItem');
        localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Suppression de valeur stocké en local
     * @param key
     * @constructor
     */
    public FunctionStorageRemoveItem(key: string) {
        return localStorage.removeItem(key);
    }

    downloadFile(path: string): Observable<Blob> {
        const url =this._gateway+'download_certificate?service=drtss-ms'; // URL de votre backend
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post(url, { path }, { headers, responseType: 'blob' });
      }


}
