import { JwtHelperService } from '@auth0/angular-jwt';
import { HandleService } from './../core/handle.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export class NotLoggedIn {}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
     private jwtHelper = new JwtHelperService();
     constructor(
          private http: HttpClient,

          private router: Router,
          private handle: HandleService
          ){

                    this.carregarJwtPayload();

          }

     private oauthTokenUrl = 'http://localhost:8080/oauth/token';
     private logoutPath = 'http://localhost:8080/tokens/revoke';
     jwtPayload: any;
     private headers = new HttpHeaders({
         'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic YW5ndWxhcjpAbmd1bEByMA=='
     });

     temPermissao(permissao: string){
          return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
     }

     entrar(usuario: string, password: string): Promise<void> {

          const body = `username=${usuario}&password=${password}&grant_type=password`;

          return this.http.post(this.oauthTokenUrl, body, {headers: this.headers, withCredentials: true})
          .toPromise()
          .then(response => {
               this.armazenarToken(JSON.parse(JSON.stringify(response)).access_token);
               this.router.navigate(['/lancamentos']);

          })
          .catch(response => {
               let resposta = response;
               if (response.status === 400){
                    const respostaJson = JSON.parse(JSON.stringify(response));

                    if (respostaJson.error.error === 'invalid_grant'){

                         resposta = 'Usuário ou senha inválidos';

                    }

               }
               this.handle.handle(resposta);
               console.log(response);
          });
     }
     temQualquerPermissao(roles) {
          for(const role of roles){
               if(this.temPermissao(role)){
                    return true;
               }
          }
          return false;
     }
     obterNovoAcessToken(): Promise<void>{
          const body = 'grant_type=refresh_token';

          return this.http.post(this.oauthTokenUrl, body , {headers: this.headers, withCredentials: true})
          .toPromise()
          .then(token => {
               this.armazenarToken(JSON.parse(JSON.stringify(token)).access_token);
               if(this.isAccessTokenInvalid()){
                    throw new NotLoggedIn();

               }
               return Promise.resolve(null);
          })
          .catch(erro => {

               this.handle.handle(erro);
               return Promise.resolve(null);
          })
     }
     armazenarToken(token: string){
          this.jwtPayload = this.jwtHelper.decodeToken(token);
          localStorage.setItem('token', token);
     }

     carregarJwtPayload() {
          const token = localStorage.getItem('token');

          if(token !== null || token ){
               this.jwtPayload = this.jwtHelper.decodeToken(token);
          }
     }

     isAccessTokenInvalid() {
          return !localStorage.getItem('token') || this.jwtHelper.isTokenExpired(localStorage.getItem('token'));
     }

     logout(){

          return this.http.delete(this.logoutPath, {withCredentials: true})
          .toPromise()
          .then(() => {
               this.limparAccessToken();
          });
     }
     limparAccessToken(){
          this.jwtPayload = null;
          localStorage.removeItem('token');
     }

}
