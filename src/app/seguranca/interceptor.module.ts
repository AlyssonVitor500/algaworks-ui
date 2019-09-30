
import { Injectable, NgModule } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{



    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

     let token = 'Bearer ' + localStorage.getItem('token');


     if (req.headers.get('Authorization') == 'Basic YW5ndWxhcjpAbmd1bEByMA=='){
          const headr = new HttpHeaders({
               'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic YW5ndWxhcjpAbmd1bEByMA=='
           });
           const dupReq = req.clone({headers: headr});
           return next.handle(dupReq);
     }

     if (req.headers.get('Content-Type') == 'application/json'){

           const dupReq = req.clone({headers: req.headers.append('Authorization', token)});
           return next.handle(dupReq);
     }

     const headr = new HttpHeaders({

           Authorization: token

     });

     const dupReq = req.clone({headers: headr});
     return next.handle(dupReq);
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
