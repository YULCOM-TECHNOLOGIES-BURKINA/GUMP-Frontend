import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private spinnerService: NgxSpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.show();

    return next.handle(req).pipe(
      finalize(() => {
        this.spinnerService.hide(); 
      })
    );
  }
}
