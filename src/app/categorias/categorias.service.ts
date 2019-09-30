import { AuthService } from 'src/app/seguranca/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

     origem = "http://localhost:8080/categorias";



     constructor(private http: HttpClient, private auth: AuthService) { }

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
