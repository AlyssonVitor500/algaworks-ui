import { PessoaPesquisaComponent } from './pessoa-pesquisa/pessoa-pesquisa.component';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../seguranca/auth.guard';




const rotas: Routes = [


     {
          path: 'pessoas',
          component: PessoaPesquisaComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_PESQUISAR_PESSOA']}
     },
     {
          path: 'pessoas/novo',
          component: PessoaCadastroComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_CADASTRAR_PESSOA']}
     },
     {
          path: 'pessoas/:codigo',
          component: PessoaCadastroComponent,
          canActivate: [AuthGuard],
          data: { roles: ['ROLE_CADASTRAR_PESSOA']}
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

   export class PessoasRoutingModule { }
