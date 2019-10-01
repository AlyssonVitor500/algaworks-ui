import { environment } from './../../environments/environment';
import { AuthService } from 'src/app/seguranca/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

     origem: string;



     constructor(private http: HttpClient, private auth: AuthService) {
          this.origem = ` ${environment.apiUrl}/categorias`;

      }

     listarCategorias(): Promise<any> {
          this.renovarAccessToken();
          return this.http.get(`${this.origem}`)
          .toPromise()
          .then(categorias => categorias);
     }

     renovarAccessToken(){
          if (this.auth.isAccessTokenInvalid()){
               this.auth.obterNovoAcessToken();
          }
     }

}
