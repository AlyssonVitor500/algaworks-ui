import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


     if (this.auth.isAccessTokenInvalid() ) {

        return this.auth.obterNovoAcessToken()
        .then(() => {
          if(this.auth.isAccessTokenInvalid()){
               this.router.navigate(['/login']);
               return false;
          }
          return true;
        });



    }else
    if(next.data.roles && !this.auth.temQualquerPermissao(next.data.roles)){
         this.router.navigate(['/pagina-nao-autorizada']);
         return false;

    }


    return true;
  }

}
