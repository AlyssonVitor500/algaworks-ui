
import { Injectable, NgModule } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ProgressBarService } from '../shared/progress-bar.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
     constructor(private auth: AuthService, private progressBarService: ProgressBarService) {  }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     this.progressBarService.showProgressBar();

     let token = 'Bearer ' + localStorage.getItem('token');


     if (req.headers.get('Content-Type') == 'application/x-www-form-urlencoded'){

          const headr = new HttpHeaders({
               'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic YW5ndWxhcjpAbmd1bEByMA=='
           });
          const dupReq = req.clone({headers: headr});

          return next.handle(dupReq)
          .pipe(finalize(() => {
               this.progressBarService.hideProgressBar();
          }));
     }

     if (req.headers.get('Content-Type') == 'application/json'){

           const dupReq = req.clone({headers: req.headers.append('Authorization', token)});
           return next.handle(dupReq)
           .pipe(finalize(() => this.progressBarService.hideProgressBar()));
     }

     const headr = new HttpHeaders({

           Authorization: token

     });

     const dupReq = req.clone({headers: headr});
     return next.handle(dupReq)
     .pipe(finalize(() => this.progressBarService.hideProgressBar()));
    }
}

@NgModule(
     {
     providers: [
     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
     ]
     }
     )
export class InterceptorModule { }
