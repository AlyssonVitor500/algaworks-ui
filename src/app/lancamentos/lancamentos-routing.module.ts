import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { LancamentoPesquisaComponent } from './lancamento-pesquisa/lancamento-pesquisa.component';

import { RouterModule, Routes, CanActivate } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../seguranca/auth.guard';




const rotas: Routes = [


     {
          path: 'lancamentos',
          component: LancamentoPesquisaComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_PESQUISAR_LANCAMENTO']}
     },
     {
          path: 'lancamentos/novo',
          component: LancamentoCadastroComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_CADASTRAR_LANCAMENTO']}
     },
     {
          path: 'lancamentos/:codigo',
          component: LancamentoCadastroComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_CADASTRAR_LANCAMENTO']}
     }

];


@NgModule({
     imports: [
       RouterModule.forChild(rotas)

     ],
     exports: [
          RouterModule
     ]
   })

   export class LancamentosRoutingModule { }
