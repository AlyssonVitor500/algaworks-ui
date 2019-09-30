import { NotLoggedIn } from './../seguranca/auth.service';
import { Router } from '@angular/router';

import { ToastyService } from 'ng2-toasty';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class HandleService {

  constructor(private toastyService: ToastyService, private router: Router) { }

  handle(exception: any){
     let msg: string;
     if (typeof exception === 'string'){
          msg = exception;

     } else if (exception instanceof NotLoggedIn) {
          msg = 'Sua sessão expirou-se, logue novamente.';
          this.router.navigate(['/login']);
     } else if (exception.status >= 400 && exception.status <= 499) {
          msg = 'Ocorreu um erro ao processar essa ação';

          if (exception.status === 403) {
               msg = 'Você não está autorizado (a) a usar esse recurso!';
          }
     } else{
          msg = 'Erro ao processar serviço remoto. Tente novamente!';

     }
     this.toastyService.error(msg);
  }
}


