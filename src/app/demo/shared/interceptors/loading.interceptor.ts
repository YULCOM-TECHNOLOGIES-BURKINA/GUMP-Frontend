import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private spinnerService: NgxSpinnerService) {}

    // Récupère le token depuis le localStorage
    private getToken(): string | null {
        return localStorage.getItem('currentToken');
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.getToken();

         if (!token) {
            return next.handle(req);
        }

         this.spinnerService.show();

        const modifiedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return next.handle(modifiedReq).pipe(
            finalize(() => {
                this.spinnerService.hide();
            })
        );
    }
}
