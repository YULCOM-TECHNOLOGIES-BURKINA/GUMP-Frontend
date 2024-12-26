import { 
    HttpEvent, 
    HttpHandler, 
    HttpInterceptor,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { KeycloakAuthService } from '../../services/keycloak-auth.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    private jwtHelper = new JwtHelperService();

    constructor(
        private spinnerService: NgxSpinnerService,
        private authService: KeycloakAuthService
    ) {}

    // Récupère le token depuis le localStorage
    private getToken(): string | null {
        return localStorage.getItem('currentToken');
    }

    // Vérifie si le token est expiré
    private isTokenExpired(token: string): boolean {
        try {
            return this.jwtHelper.isTokenExpired(token);
        } catch (error) {
            console.error('Erreur lors de la vérification du token:', error);
            return true; // En cas d'erreur, on considère le token comme expiré
        }
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.getToken();

        if (!token) {
            return next.handle(req);
        }

        // Vérifier si le token est expiré
        if (this.isTokenExpired(token)) {
            this.authService.logout(); // Déconnexion forcée
            return throwError(() => new Error('Token expiré'));
        }

        this.spinnerService.show();

        const modifiedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });

        return next.handle(modifiedReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Token invalide ou expiré côté serveur
                    this.authService.logout();
                }
                return throwError(() => error);
            }),
            finalize(() => {
                this.spinnerService.hide();
            })
        );
    }
}